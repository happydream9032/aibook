import axios from "axios";
import Image from "next/image";
import ResultTable from "./ResultTable";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useDuckDb } from "duckdb-wasm-kit";
import { exportArrow } from "duckdb-wasm-kit";
import { insertFile } from "duckdb-wasm-kit";
import { setChangeDuckBookData } from "@/redux/features/navbar-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import "react-toastify/dist/ReactToastify.css";

import RunSQLQueryIcon from '@/assets/images/icons/RunSQLQueryIcon.svg';
import MoreViewIcon from "@/assets/images/icons/MoreView.svg";

interface element_type {
  db: any,
  type: number,
  isPrompt: string,
  index: number,
  isfilename: string,
  isSQLQuery: string,
  isfilesize: number,
  istablename: string,
  isreturn: number,
}

const RunSQL = (props: {
  type: any;
  index: number;
  db: any;
  getSelectedComponentData: (data: any) => void;
}) => {
  const dispatch = useAppDispatch();
  const { db } = useDuckDb();
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);

  const [isSQLQuery, setIsSQLQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<element_type>({
    db: null,
    type: 0,
    isPrompt: "",
    index: 0,
    isfilename: "",
    isSQLQuery: "",
    istablename: "",
    isfilesize: 0,
    isreturn: 0,
  });
  const [isShowComponent, setIsShowComponent] = useState(true);
  const [exportFileName, setExportFileName] = useState("aiprompt");
  const [downloadFileCount, setDownloadFileCount] = useState(0);
  const [isSQLDropMenu, setIsSQLDropMenu] = useState(false);

  useEffect(() => {
    let type = props.type;
    if (type.type === 2 && type.value != "") {
      let json_tabledata: any = {
        db: props.db,
        type: type.type,
        index: props.index,
        isfilename: type.path.filepath,
        isSQLQuery: type.value,
        istablename: type.path.table_name,
        isreturn: 0,
      };
      console.log("current db is", json_tabledata);
      setIsSQLQuery(type.value);
      setTableData(json_tabledata);
      setIsLoading(true);
    }
  }, [props]);

  const handleRunQuery = async () => {
    try {
      if (isSQLQuery != "") {
        let json_tabledata: any = {
          db: db,
          isfilename: "runquery",
          isSQLQuery: isSQLQuery,
          type: 2,
          index: props.index,
          istablename: "runquery",
          isreturn: 1,
        };
        setTableData(json_tabledata);
        setIsLoading(true);
      }
    } catch (error) {
      toast.error("Run SQL Query is Failure", { position: "top-right" });
      console.error("Error21:", error);
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
        console.error("File download failed9", error);
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
        console.error("File download failed", error);
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
        console.error("File download failed", error);
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
        console.error("Error:", error.message);
        // Handle the error
      });
  };

  return (
    <div className="flex flex-col">
      {isShowComponent && (
        <div
          onClick={() => {
            let data: any = {
              type: tableData["type"],
              path: {
                table_name: "runquery",
                file_path: "runquery",
              },
            };
            props.getSelectedComponentData(data);
          }}
        >
          <ToastContainer />
          <div className="ma-[3px] my-6 flex flex-col w-full rounded-lg border border-indigo-700 shadow">
            <div className="w-full relative pr-20 px-2 py-3 pl-4 bg-black min-h-[110px]">
              <textarea
                id="comment"
                rows={4}
                className="w-full h-full resize-none px-2 py-2 text-sm rounded-md text-white bg-black border border-gray-500 hover:border-indigo-400 focus:ring-0"
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
                    handleRunQuery();
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
            {isLoading && (
              <>
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
                            width="24"
                            height="24"
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RunSQL;
