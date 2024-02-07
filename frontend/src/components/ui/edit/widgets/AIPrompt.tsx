import axios from "axios";
import Image from "next/image";
import ResultTable from "./ResultTable";
import { useDuckDb } from "duckdb-wasm-kit";
import { insertFile } from "duckdb-wasm-kit";
import { exportArrow } from "duckdb-wasm-kit";
import { useState, useEffect } from "react";
import { setChangeDuckBookData } from "@/redux/features/navbar-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import GPT4Icon from "@/assets/images/icons/GPT4.svg";
import ContentCopy from "@/assets/images/icons/ContentCopy.svg";
import RunSQLQueryIcon from '@/assets/images/icons/RunSQLQueryIcon.svg';
import MoreViewIcon from "@/assets/images/icons/MoreView.svg";
import NewIcon1 from "@/assets/images/icons/NewIcon1.svg";

const AIPrompt = (props: {
  type: any;
  index: number;
  db: any;
  getSelectedComponentData: (data: any) => void;
}) => {
  const dispatch = useAppDispatch();
  const { db } = useDuckDb();
  const type = useAppSelector((state) => state.todoReducer.type);
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);

  const [isSQLQuery, setIsSQLQuery] = useState("");
  const [promptvalue, setPromptValue] = useState("");
  const [ispromptfinish, setIsPromptFinish] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tableData, setTableData] = useState({});
  const [isFailuer, setIsFailure] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // statue get query
  const [isRunLoading, setIsRunLoading] = useState(false); // status get result of run query
  const [isShowComponent, setIsShowComponent] = useState(true);
  const [exportFileName, setExportFileName] = useState("aiprompt");
  const [downloadFileCount, setDownloadFileCount] = useState(0);
  const [isSQLDropMenu, setIsSQLDropMenu] = useState(false);

  useEffect(() => {
    let type = props.type;
    if (type.type === 4 && type.value != "") {
      let json_value = JSON.parse(type.value);
      let isSQLQuery = json_value.query;
      let json_tabledata: any = {
        db: props.db,
        type: type.type,
        isPrompt: json_value.prompt,
        index: props.index,
        isfilename: type.path.filepath,
        isSQLQuery: isSQLQuery,
        istablename: type.path.table_name,
        isreturn: 0,
      };
      setPromptValue(json_value.prompt)
      setTableData(json_tabledata);
      setIsSQLQuery(json_value.query);
      handleRunQuery(json_value.query, true);
      setIsLoading(true);
    }
  }, [props]);

  function handleKeyDown(event: any) {
    if (event.key === "Enter") {
      // Perform your desired action here
      setIsPromptFinish(true);
      handleRunPrompt();
    }
  }
  const handleCopy = () => {
    // Copy the text to the clipboard
    navigator.clipboard
      .writeText(promptvalue)
      .then(() => {
        // Text successfully copied
        setCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        // Unable to copy the text
        console.error("Failed to copy: ", err);
      });
  };

  const handleRunPrompt = async () => {
    try {
      let conn = await db.connect();
      if (promptvalue != "") {
        let schema_tables = await conn.query(
          "SELECT table_name FROM information_schema.tables;"
        );

        let colume_length_array = schema_tables._offsets;
        let column_length = colume_length_array[colume_length_array.length - 1];
        let schema = [];
        for (let i = 0; i < Number(column_length); i++) {
          let temp_schema: any = {
            table_name: "",
            row: {},
            data: {},
          };

          let temp = schema_tables.get(i).toArray(); // get table names
          //get first row of all tables.
          let sub_table = await conn.query(
            `SELECT * FROM '${String(temp)}' LIMIT 1;`
          );
          let sub_table_schema = sub_table.schema.fields;
          let data_array = sub_table.get(0).toArray();
          // make schema with table name, types of row and column data
          let temp_schema_row: any = {};
          let temp_schema_data: any = {};
          temp_schema["table_name"] = String(temp);
          for (let i = 0; i < sub_table_schema.length; i++) {
            temp_schema_row[sub_table_schema[i]["name"]] = String(
              sub_table_schema[i]["type"]
            );
            temp_schema_data[sub_table_schema[i]["name"]] = String(
              data_array[i]
            );
          }
          temp_schema["row"] = temp_schema_row;
          temp_schema["data"] = temp_schema_data;
          console.log(schema, temp_schema);
          schema.push(JSON.stringify(temp_schema));
        }
        const data = {
          schema: schema.toString(),
          prompt: promptvalue,
          model: type
        };
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/runprompt";
        await axios
          .post(apiUrl, data)
          .then((response) => {
            console.log("response is", response);
            setIsSQLQuery(response.data);
            handleRunQuery(response.data, true);
            setIsLoading(true);
          })
          .catch((error) => {
            console.error("Error12:", error.message);
            // Handle the error
          });
      }
      conn.close();
    } catch (error) {
      console.error("Error11:", error);
      setIsRunLoading(true);
      setIsFailure(true);
    }
  };

  const handleRunQuery = async (query: string, type: boolean) => {
    try {
      let data = "";
      if (type == true) {
        data = query;
      } else {
        data = isSQLQuery;
      }
      let json_tabledata: any = {
        db: props.db,
        type: 4,
        index: props.index,
        isPrompt: promptvalue,
        isfilename: "aiprompt",
        isSQLQuery: data,
        istablename: "aiprompt",
        isreturn: 1,
      };
      setTableData(json_tabledata);
      setIsRunLoading(true);
    } catch (error) {
      console.error("Error13:", error);
      setIsRunLoading(true);
      setIsFailure(true);
    }
  };

  const downloadFile = async (type: number) => {
    let conn = props.db.connect();
    let query = isSQLQuery.replaceAll(";", "");

    let temp = exportFileName.split(".");
    let original_filename = temp[0];

    if (type == 0) {
      let filename = original_filename + ".csv";
      conn.query(`COPY (${query}) TO '${filename}' (HEADER, DELIMITER ',');`);
      const buffer = props.db.copyFileToBuffer(filename);
      try {
        const blob = new Blob([buffer], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // Replace with the actual file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("File download failed1", error);
      }
    } else if (type == 1) {
      let filename = original_filename + ".parquet";
      let compression = "gzip";
      conn.query(
        `COPY (${query}) TO '${filename}' (FORMAT PARQUET, COMPRESSION ${compression});`
      );
      const buffer = props.db.copyFileToBuffer(filename);
      try {
        const blob = new Blob([buffer], {
          type: "application/vnd.apache.parquet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // Replace with the actual file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("File download failed2", error);
      }
    } else if (type == 2) {
      let filename = original_filename + ".arrow";
      let filename1 = original_filename + String(downloadFileCount) + ".csv";
      conn.query(`COPY (${query}) TO '${filename1}' (HEADER, DELIMITER ',');`);
      const buffer = props.db.copyFileToBuffer(filename1);
      const blob = new Blob([buffer], { type: "text/csv" });
      const file = new File([blob], "data.csv", {
        type: "text/csv",
        lastModified: Date.now(),
      });
      setDownloadFileCount(downloadFileCount + 1);

      await insertFile(props.db, file, filename1);
      let new_file = await exportArrow(props.db, filename1, filename);
      try {
        const arrayBuffer = await new_file.arrayBuffer();
        const buffer1 = Buffer.from(arrayBuffer);

        const blob1 = new Blob([buffer1], {
          type: "application/vnd.apache.arrow.file",
        });
        const url = window.URL.createObjectURL(blob1);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // Replace with the actual file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("File download failed3", error);
      }
    }
    conn.close();
  };

  const DeleteComponent = async (index: number, id: number) => {
    let array = JSON.parse(duckbook["DATA"]);
    array.splice(index, 1);

    dispatch(setChangeDuckBookData(JSON.stringify(array)));

    let data = {
      DATA: JSON.stringify(array),
      ID: id,
    };

    let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/changedbdata";
    await axios
      .post(update_apiUrl, data)
      .then((response) => {
        console.log("update response is", response.data);
      })
      .catch((error) => {
        console.error("Error15:", error.message);
        // Handle the error
      });
  };

  return (
    <div>
      {isShowComponent && (
        <div
          onClick={() => {
            let data: any = {
              type: 4,
              path: {
                table_name: tableData["istablename"],
                file_path: tableData["isfilename"],
              },
            };
            props.getSelectedComponentData(data);
          }}
        >
          {ispromptfinish ? (
            <div className="mb-5">
              <div className="w-full px-4 py-2 gap-2 text-indigo-400 font-medium text-lg w-full flex items-center justify-between">
                <div className="items-center gap-3 lg:flex flex-1">
                  <Image src={GPT4Icon} alt="" width="24" height="24" />

                  <input
                    className="text-sm text-indigo-500 font-semibold w-full border border-transparent focus:outline-none"
                    type="text"
                    value={promptvalue}
                    onChange={(e) => {
                      e.preventDefault();
                      setPromptValue(e.target.value);
                      if (e.target.value == "/") {
                        setIsShowComponent(false);
                      } else {
                        setIsShowComponent(true);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  {/* <span>{promptvalue}</span> */}
                </div>
                <div>
                  <button
                    className="text-gray-500 bg-white hover:bg-gray-200 focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center"
                    type="button"
                    title={""}
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <div className=" text-green-600">
                        <Image
                          src={ContentCopy}
                          alt=""
                          width="15"
                          height="15"
                        />
                      </div>
                    ) : (
                      <Image
                        src={NewIcon1}
                        alt=""
                        width="15"
                        height="15"
                      />
                    )}
                  </button>
                </div>
              </div>
              {isLoading && (
                <div>
                  {isFailuer ? (
                    <div
                      role="alert"
                      className="relative w-full p-4 pl-11 translate-y-[-3px] border-destructive/50 text-destructive dark:border-destructive text-destructive border-2 bg-red-50 rounded-md rounded-t-none"
                    >
                      <h5 className="mb-1 font-medium leading-none tracking-tight">
                        Oops!
                      </h5>
                      <div className="text-sm [&amp;_p]:leading-relaxed whitespace-pre-wrap">
                        Something went wrong calling the OpenAI API
                      </div>
                    </div>
                  ) : (
                    <div className="ma-[3px] flex flex-col rounded-lg border border-indigo-700 shadow">
                      <div className="w-full relative pr-20 py-3 pl-4 bg-black min-h-[110px]">
                        <textarea
                          id="comment"
                          rows={4}
                          value={isSQLQuery}
                          className="w-full h-full resize-none text-sm rounded-md text-white bg-black border border-gray-500 hover:border-indigo-400 focus:ring-0"
                          placeholder=" Paste data here"
                          required
                          onChange={(e) => {
                            setIsSQLQuery(e.currentTarget.value);
                          }}
                        ></textarea>
                        <div className="absolute bottom-4 right-4">
                          <button
                            className="bg-gray-200 rounded-md px-2 py-2"
                            type="button"
                            title={""}
                            onClick={() => {
                              setTableData({});
                              handleRunQuery("", false);
                            }}
                          >
                            <Image
                              src={RunSQLQueryIcon}
                              alt=""
                              width="24"
                              height="24"
                            />
                          </button>
                        </div>
                      </div>
                      {isRunLoading && (
                        <div>
                          <ResultTable data={tableData} />
                          <div className="flex h-[30px] items-center my-2">
                            <div className="px-2 w-full flex items-center justify-between">
                              <input
                                className="flex-1 mb-2 text-sm text-gray-500 border border-transparent focus:outline-none"
                                value={exportFileName}
                                onChange={(e) => {
                                  e.preventDefault();
                                  setExportFileName(e.currentTarget.value);
                                }}
                              ></input>
                              <div className="items-center gap-3 lg:flex">
                                <div className="relative inline-block flex justify-end">
                                  <button
                                    type="button"
                                    className="px-1 py-1 mx-1 mb-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                                    onClick={() => {
                                      setIsSQLDropMenu(!isSQLDropMenu);
                                    }}
                                    title={""}
                                  >
                                    <Image
                                      src={MoreViewIcon}
                                      alt=""
                                      width="20"
                                      height="20"
                                    />
                                  </button>

                                  {isSQLDropMenu && (
                                    <div className="top-center z-[20] absolute right-0 mt-8 mb-2 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                      <ul
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="options-menu"
                                        className="w-[130px]"
                                      >
                                        <li
                                          role="menuitem"
                                          className="w-full justify-start text-sm bg-white text-gray-300 px-3 py-2"
                                        >
                                          Export as ...
                                        </li>
                                        <li role="menuitem">
                                          <button
                                            type="button"
                                            className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                                            onClick={() => {
                                              downloadFile(0);
                                            }}
                                          >
                                            <span className="text-sm text-black">
                                              CSV
                                            </span>
                                          </button>
                                        </li>
                                        <li role="menuitem">
                                          <button
                                            type="button"
                                            className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                                            onClick={() => {
                                              downloadFile(1);
                                            }}
                                          >
                                            <span className="text-sm text-black">
                                              Parquet
                                            </span>
                                          </button>
                                        </li>
                                        <li role="menuitem">
                                          <button
                                            type="button"
                                            className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                                            onClick={() => {
                                              downloadFile(2);
                                            }}
                                          >
                                            <span className="text-sm text-black">
                                              Arrow
                                            </span>
                                          </button>
                                        </li>
                                        <li role="menuitem">
                                          <button
                                            type="button"
                                            className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                                            onClick={() => {
                                              DeleteComponent(
                                                props.index,
                                                duckbook["ID"]
                                              );
                                              setIsShowComponent(false);
                                            }}
                                          >
                                            <span className="text-sm text-red-600">
                                              Delete Doc
                                            </span>
                                          </button>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <input
              className="text-lg text-indigo-500 font-semibold w-full border border-transparent focus:outline-none"
              type="text"
              value={promptvalue}
              placeholder="Ask AI to write SQL for you"
              onChange={(e) => {
                setPromptValue(e.target.value);
                if (e.target.value == "") {
                  setIsShowComponent(false);
                } else {
                  setIsShowComponent(true);
                }
              }}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AIPrompt;
