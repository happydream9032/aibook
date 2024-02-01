import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import { insertFile } from "duckdb-wasm-kit";
import { exportArrow } from "duckdb-wasm-kit";
import ResultTable from "./ResultTable";
import { exportParquet } from "duckdb-wasm-kit";
import { setChangeDuckBookData } from "@/redux/features/navbar-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import MoreViewIcon from "@/assets/images/icons/MoreView.svg";

const Importfile = (props: {
  type: any;
  index: number;
  db: any;
  getSelectedComponentData: (data: any) => void;
}) => {
  const dispatch = useAppDispatch();
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);

  const [isComponentType, setIsComponentType] = useState(props.type);
  const [isComponentNumber, setIsComponentNumber] = useState(props.index);
  const [isImportTab, setIsImportTab] = useState(true);
  const [isFetchTab, setIsFetchTab] = useState(false);
  const [isPasteTableTab, setIsPasteTableTab] = useState(false);
  const [isExampleTab, setIsExampleTab] = useState(false);
  const [isValue, setIsValue] = useState([]);
  const [isloading1, setIsLoading1] = useState(false);
  const [isloading2, setIsLoading2] = useState(false);
  const [isfetchurl, setIsFetchUrl] = useState("");
  const [istableshow, setIsTableShow] = useState(false);
  const [tableData, setTableData] = useState({});
  const [isstringtabledata, setIsStringTableData] = useState("");
  const [isShowComponent, setIsShowComponent] = useState(true);
  const [exportFileName, setExportFileName] = useState("");
  const [isSQLQuery, setSQLQuery] = useState("");
  const [downloadFileCount, setDownloadFileCount] = useState(0);
  const [isSQLDropMenu, setIsSQLDropMenu] = useState(false);
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [isTableDBData, setIsTableDBData] = useState({
    table_name: "",
    table_data: null,
    id: null,
  });

  useEffect(() => {
    let type = isComponentType;
    if (type.type === 11 || type.type === 12 || type.type === 14) {
      let isSQLQuery = `SELECT * FROM '${type.path.table_name}';`;
      let json_tabledata: any = {
        db: props.db,
        type: type.type,
        index: isComponentNumber,
        isfilename: type.path.filepath,
        isSQLQuery: isSQLQuery,
        istablename: type.path.table_name,
        isfilesize: type.path.filesize,
        isreturn: 0,
      };
      console.log("current db is", json_tabledata);
      setSQLQuery(isSQLQuery);
      setTableData(json_tabledata);
      setExportFileName(type.path.table_name);
      setIsTableShow(true);
    }
  }, [duckbook]);

  const handleLoadingError = (type: boolean) => {
    setIsLoadingError(type);
  };

  const getBufferfromFile = async (filename: string) => {
    try {
      let myArray: any = JSON.parse(localStorage.getItem("my-array"));
      let count = 0;
      myArray.map((item: any, index: number) => {
        if (item["title"] == filename) {
          count = count + 1;
        }
      });
      if (count == 0) {
        let file = await exportParquet(props.db, filename, filename, "zstd");
        let temp_file: any = { title: "", content: "" };
        let binary = "";
        let arrayBuffer = await file.arrayBuffer();
        let bytes = new Uint8Array(arrayBuffer);

        let len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        let result = window.btoa(binary);

        temp_file["title"] = filename;
        temp_file["content"] = String(result);

        myArray.push(temp_file);
        localStorage.setItem("my-array", JSON.stringify(myArray));
      }
    } catch (error) {
      console.error("File download failed6", error);
    }
  };

  const handleFileChange = async (e: any) => {
    let csvfile = e.target.files[0];
    if (csvfile != null) {
      console.log(csvfile.name);
      let conn = await props.db.connect();

      let table_count_query = await conn.query(
        `SELECT * FROM information_schema.tables WHERE TABLE_NAME LIKE '${csvfile.name}';`
      );
      let table_count_array = table_count_query._offsets;
      let table_count = table_count_array[table_count_array.length - 1];

      if (Number(table_count) == 0) {
        await insertFile(props.db, csvfile, csvfile.name);
      }
      await getBufferfromFile(csvfile.name);

      let query = `SELECT * FROM '${csvfile.name}';`;
      let json_tabledata: any = {
        db: props.db,
        type: 11,
        index: isComponentNumber,
        isfilename: csvfile.name,
        isSQLQuery: query,
        istablename: csvfile.name,
        isfilesize: csvfile.size,
        isreturn: 1,
      };
      setSQLQuery(query);
      setTableData(json_tabledata);
      setExportFileName(csvfile.name);
      setIsTableShow(true);
      conn.close();
    }
  };

  const handleFetchUrl = async () => {
    if (isfetchurl != "") {
      let conn = await props.db.connect();
      let arry = isfetchurl.split("/");
      let lastElement = arry[arry.length - 1];
      let temp_file = null;

      let table_count_query = await conn.query(
        `SELECT * FROM information_schema.tables WHERE TABLE_NAME LIKE '${lastElement}';`
      );
      let table_count_array = table_count_query._offsets;
      let table_count = table_count_array[table_count_array.length - 1];

      if (Number(table_count) == 0) {
        if (
          String(lastElement).includes(".csv") ||
          String(lastElement).includes(".CSV")
        ) {
          let table_column: any = [];
          let table_row: any = [];

          await fetch(isfetchurl)
            .then((response) => response.text())
            .then((csvText) => {
              let rowData = [];
              let array = [];
              // Split the CSV data into rows
              rowData = csvText.split("\n");
              for (let i = 1; i < rowData.length; i++) {
                let temp = rowData[i].split(",");
                array.push(temp);
              }
              table_column = array;
              table_row = rowData[0];
            });
          console.log("--", table_column);
          let csv = table_column.map((row: any) => row.join(",")).join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const file = new File([blob], "data.csv", {
            type: "text/csv",
            lastModified: Date.now(),
          });
          await insertFile(props.db, file, lastElement);
          temp_file = file;
        } else if (
          String(lastElement).includes(".parquet") ||
          String(lastElement).includes(".PARQUET")
        ) {
          temp_file = await exportParquet(
            props.db,
            lastElement,
            "temp.parquet",
            "zstd"
          );
          await conn.query(
            `CREATE TABLE '${lastElement}' AS SELECT * FROM read_parquet('${isfetchurl}');`
          );
        }
      }

      await getBufferfromFile(lastElement);
      let json_tabledata: any = {
        db: props.db,
        type: 12,
        index: isComponentNumber,
        isfilename: isfetchurl,
        isSQLQuery: `SELECT * FROM '${lastElement}';`,
        istablename: lastElement,
        isfilesize: temp_file.size,
        isreturn: 1,
      };
      setSQLQuery(`SELECT * FROM '${lastElement}';`);
      setTableData(json_tabledata);
      setIsTableShow(true);
      conn.close();
    }
  };

  const handlePasteTable = async (data: string) => {
    let stringTableData = data;
    if (stringTableData != "") {
      let table_name = "pastTable";
      let conn = await props.db.connect();
      let file: File;
      let table_count_query = await conn.query(
        `SELECT * FROM information_schema.tables WHERE TABLE_NAME LIKE '${table_name}';`
      );
      let table_count_array = table_count_query._offsets;
      let table_count = table_count_array[table_count_array.length - 1];

      if (Number(table_count) > 0) {
        let rowData = [];
        let array = [];
        // Split the CSV data into rows
        rowData = stringTableData.split("\n");
        for (let i = 1; i < rowData.length; i++) {
          let temp = rowData[i].split("\t");
          array.push(temp);
        }
        let csv = array.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        file = new File([blob], "data.csv", {
          type: "text/csv",
          lastModified: Date.now(),
        });
        await insertFile(props.db, file, table_name);
      }

      await getBufferfromFile(table_name);

      let check_table = await conn.query(`SELECT * FROM '${table_name}';`);

      let json_tabledata: any = {
        db: props.db,
        type: 13,
        index: isComponentNumber,
        isfilename: "data" + String(table_count) + ".csv",
        isSQLQuery: `SELECT * FROM '${table_name}';`,
        istablename: table_name,
        isfilesize: file.size,
        isreturn: 1,
      };
      setTableData(json_tabledata);
      setIsTableShow(true);
      conn.close();
    }
  };

  const downloadFile = async (type: number) => {
    let conn = await props.db.connect();
    let query = isSQLQuery.replaceAll(";", "");
    let file_type = "";

    let temp = exportFileName.split(".");
    let original_filename = temp[0];

    if (type == 0) {
      let filename = original_filename + ".csv";
      conn.query(`COPY (${query}) TO '${filename}' (HEADER, DELIMITER ',');`);
      const buffer = await props.db.copyFileToBuffer(filename);
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
        console.error("File download failed7", error);
      }
    } else if (type == 1) {
      let filename = original_filename + ".parquet";
      let compression = "gzip";
      conn.query(
        `COPY (${query}) TO '${filename}' (FORMAT PARQUET, COMPRESSION ${compression});`
      );
      const buffer = await props.db.copyFileToBuffer(filename);
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
        console.error("File download failed8", error);
      }
    } else if (type == 2) {
      let filename = original_filename + ".arrow";
      let filename1 = original_filename + String(downloadFileCount) + ".csv";
      conn.query(`COPY (${query}) TO '${filename1}' (HEADER, DELIMITER ',');`);
      const buffer = await props.db.copyFileToBuffer(filename1);
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
        console.error("File download failed9", error);
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
        console.error("Error18:", error.message);
        // Handle the error
      });
  };

  return (
    <div>
      {isShowComponent && (
        <div
          onClick={() => {
            let data: any = {
              type: tableData["type"],
              path: {
                table_name: tableData["istablename"],
                file_path: tableData["isfilename"],
                file_size: tableData["isfilesize"],
              },
            };
            props.getSelectedComponentData(data);
          }}
        >
          {istableshow ? (
            <div className="my-6 flex flex-col overflow-revert rounded-lg border border-indigo-700 w-full right-1 shadow">
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
                            {isLoadingError ? (
                              <div></div>
                            ) : (
                              <div>
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
                              </div>
                            )}

                            <li role="menuitem">
                              <button
                                type="button"
                                className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                                onClick={() => {
                                  DeleteComponent(props.index, duckbook["ID"]);
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
          ) : (
            <div data-node-view-wrapper="">
              {isValue ? (
                <div className="select-none flex flex-col">
                  <div className="ma-[3px] not-prose my-6 flex flex-col overflow-hidden w-full rounded-lg border border-indigo-700 shadow">
                    <div className="w-full flex justify-between">
                      <div
                        className="min-w-[180px] bg-gray-100 p-4 flex flex-col justify-start"
                        role="tablist"
                        aria-orientation="vertical"
                      >
                        <button
                          className="py-2 hover:bg-gray-100 focus:bg-indigo-50 aria-selected:font-semibold aria-selected:text-indigo-500 outline-0"
                          type="button"
                          role="tab"
                          id="mantine-kqnsv420g-tab-file"
                          aria-selected="false"
                          tabIndex={-1}
                          onClick={() => {
                            setIsImportTab(true);
                            setIsFetchTab(false);
                            setIsPasteTableTab(false);
                            setIsExampleTab(false);
                          }}
                        >
                          {isImportTab ? (
                            <span className="font-semibold text-sm text-indigo-500">
                              Import file
                            </span>
                          ) : (
                            <span className="font-semibold text-sm text-gray-900">
                              Import file
                            </span>
                          )}
                        </button>
                        <button
                          className="py-2 hover:bg-gray-100 focus:bg-indigo-50 aria-selected:font-semibold aria-selected:text-indigo-500 outline-0"
                          type="button"
                          role="tab"
                          id="mantine-kqnsv420g-tab-url"
                          aria-selected="false"
                          tabIndex={-1}
                          onClick={() => {
                            setIsImportTab(false);
                            setIsFetchTab(true);
                            setIsPasteTableTab(false);
                            setIsExampleTab(false);
                          }}
                        >
                          {isFetchTab ? (
                            <span className="font-semibold text-sm text-indigo-500">
                              Fetch Url
                            </span>
                          ) : (
                            <span className="font-semibold text-sm text-gray-900">
                              Fetch Url
                            </span>
                          )}
                        </button>
                        <button
                          className="py-2 hover:bg-gray-100 focus:bg-indigo-50 aria-selected:font-semibold aria-selected:text-indigo-500 outline-0"
                          type="button"
                          role="tab"
                          id="mantine-kqnsv420g-tab-paste"
                          aria-selected="false"
                          tabIndex={-1}
                          onClick={() => {
                            setIsImportTab(false);
                            setIsFetchTab(false);
                            setIsPasteTableTab(true);
                            setIsExampleTab(false);
                          }}
                        >
                          {isPasteTableTab ? (
                            <span className="font-semibold text-sm text-indigo-500">
                              Paste Table
                            </span>
                          ) : (
                            <span className="font-semibold text-sm text-gray-900">
                              Paste Table
                            </span>
                          )}
                        </button>
                        <button
                          className="py-2 hover:bg-gray-100 focus:bg-indigo-50 aria-selected:font-semibold aria-selected:text-indigo-500 outline-0"
                          type="button"
                          role="tab"
                          id="mantine-kqnsv420g-tab-examples"
                          aria-selected="true"
                          tabIndex={0}
                          data-active="true"
                          onClick={() => {
                            setIsImportTab(false);
                            setIsFetchTab(false);
                            setIsPasteTableTab(false);
                            setIsExampleTab(true);
                          }}
                        >
                          {isExampleTab ? (
                            <span className="font-semibold text-sm text-indigo-500">
                              Example
                            </span>
                          ) : (
                            <span className="font-semibold text-sm text-gray-900">
                              Example
                            </span>
                          )}
                        </button>
                      </div>

                      <div className="flex flex-1 justify-end">
                        {isImportTab && (
                          <div
                            className="relative flex flex-col mantine-prepend-Tabs-panel w-full p-4 mantine-prepend-1o2nnxo gap-4"
                            role="tabpanel"
                            id="mantine-kqnsv420g-panel-file"
                            aria-labelledby="mantine-kqnsv420g-tab-file"
                          >
                            <button
                              className="absolute right-4 top-4 mantine-prepend-tgtmzj"
                              type="button"
                              tabIndex={-1}
                              title={""}
                              onClick={() => {
                                DeleteComponent(props.index, duckbook["ID"]);
                                setIsShowComponent(false);
                              }}
                            >
                              <svg
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.25rem"
                                height="1.25rem"
                              >
                                <path
                                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                            <h5 className="font-bold">Import file</h5>
                            <div className="text-gray-400">
                              Load a file from your computer
                            </div>
                            <div className="flex flex-col justify-center border border-dashed border-[#e0e0e0] rounded-md">
                              <input
                                type="file"
                                name="file"
                                id="file"
                                className="sr-only"
                                onChange={(e) => {
                                  e.preventDefault();
                                  handleFileChange(e);
                                  setIsLoading1(true);
                                }}
                              />
                              <label
                                htmlFor="file"
                                className="relative gap-2 flex flex-col items-center justify-center rounded-md text-center min-h-[156px] cursor-pointer hover:bg-gray-200"
                              >
                                {isloading1 ? (
                                  <span className="rounded-lg border border-[#e0e0e0] bg-indigo-500 py-2 px-7 text-sm font-medium text-white">
                                    Loading ...
                                  </span>
                                ) : (
                                  <span className="rounded-lg border border-[#e0e0e0] bg-indigo-500 py-2 px-7 text-sm font-medium text-white">
                                    Choose file
                                  </span>
                                )}

                                <span className="block flex-col text-sm font-small text-gray-400">
                                  CSV, Parquet, or Arrow
                                </span>
                              </label>
                            </div>
                          </div>
                        )}
                        {isFetchTab && (
                          <div
                            className="relative flex flex-col mantine-prepend-Tabs-panel w-full p-4 mantine-prepend-1o2nnxo gap-4"
                            role="tabpanel"
                            id="mantine-kqnsv420g-panel-file"
                            aria-labelledby="mantine-kqnsv420g-tab-file"
                          >
                            <button
                              className="absolute right-4 top-4 mantine-prepend-tgtmzj"
                              type="button"
                              tabIndex={-1}
                              title={""}
                              onClick={() => {
                                DeleteComponent(props.index, duckbook["ID"]);
                                setIsShowComponent(false);
                              }}
                            >
                              <svg
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.25rem"
                                height="1.25rem"
                              >
                                <path
                                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                            <h5 className="font-bold">Fetch URL</h5>
                            <div className="text-gray-400">
                              Load a file from public url
                            </div>
                            <div className="w-full flex flex-col justify-center rounded-lg min-h-[156px] p-12 gap-2">
                              <div className="flex">
                                <input
                                  className="text-sm w-full border rounded-md border-gray-600 p-1 focus:border-indigo-500"
                                  type="text"
                                  placeholder=" Paste a URL to a file"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    setIsFetchUrl(e.currentTarget.value);
                                  }}
                                />
                                <button
                                  className="ml-2 bg-indigo-600 text-sm text-white py-2 px-7 rounded-md"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleFetchUrl();
                                    setIsLoading2(true);
                                  }}
                                >
                                  {isloading2 ? "Loading" : "Load"}
                                </button>
                              </div>
                              {isloading2 && (
                                <span className="flex-col items-center justify-center block text-sm font-small text-indigo-400">
                                  Loading ....
                                </span>
                              )}
                              <span className="flex-col items-center justify-center block text-sm font-small text-gray-400">
                                CSV, Parquet, or Arrow
                              </span>
                            </div>
                          </div>
                        )}
                        {isPasteTableTab && (
                          <div
                            className="relative flex flex-col mantine-prepend-Tabs-panel w-full p-4 mantine-prepend-1o2nnxo gap-4"
                            role="tabpanel"
                            id="mantine-kqnsv420g-panel-file"
                            aria-labelledby="mantine-kqnsv420g-tab-file"
                          >
                            <button
                              className="absolute right-4 top-4 mantine-prepend-tgtmzj"
                              type="button"
                              tabIndex={-1}
                              title={""}
                              onClick={() => {
                                DeleteComponent(props.index, duckbook["ID"]);
                                setIsShowComponent(false);
                              }}
                            >
                              <svg
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.25rem"
                                height="1.25rem"
                              >
                                <path
                                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                            <h5 className="font-bold">Paste Table</h5>
                            <div className="text-gray-400">
                              Paste a table of data from your clipboard
                            </div>
                            <div className="flex flex-col justify-center rounded-md min-h-[120px]">
                              <textarea
                                id="comment"
                                rows={4}
                                className="px-2 py-2 w-full h-full resize-none text-sm rounded-md text-gray-900 bg-white border border-gray-400 hover:border-indigo-400 focus:ring-0"
                                placeholder=" Paste data here"
                                required
                                onChange={(e) => {
                                  e.preventDefault();
                                  setIsStringTableData(e.currentTarget.value);
                                  handlePasteTable(e.currentTarget.value);
                                }}
                              ></textarea>
                            </div>
                            <span className="text-sm text-gray-400">
                              Try copying a table from Excel, Google Sheets, or
                              an HTML page
                            </span>
                          </div>
                        )}
                        {isExampleTab && (
                          <div
                            className="relative flex flex-col mantine-prepend-Tabs-panel w-full p-4 mantine-prepend-1o2nnxo gap-4"
                            role="tabpanel"
                            id="mantine-kqnsv420g-panel-file"
                            aria-labelledby="mantine-kqnsv420g-tab-file"
                          >
                            <button
                              className="absolute right-4 top-4 mantine-prepend-tgtmzj"
                              type="button"
                              tabIndex={-1}
                              title={""}
                              onClick={() => {
                                setIsShowComponent(false);
                              }}
                            >
                              <svg
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1.25rem"
                                height="1.25rem"
                              >
                                <path
                                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </button>
                            <h5 className="font-bold">Examples</h5>
                            <div className="text-gray-400">
                              Get started fast with an example dataset
                            </div>
                            <div className="w-full flex flex-col justify-center rounded-lg min-h-[156px] p-2 gap-2">
                              <a className="flex text-base text-indigo-700">
                                <svg
                                  className="mt-1 mr-3"
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth="0"
                                  viewBox="0 0 24 24"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path fill="none" d="M0 0h24v24H0z"></path>
                                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"></path>
                                </svg>
                                Michelin Star Restaurants
                              </a>
                              <a className="flex text-base text-indigo-700">
                                <svg
                                  className="mt-1 mr-3"
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth="0"
                                  viewBox="0 0 24 24"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M12 7.00002C16.4183 7.00002 20 10.5817 20 15C20 19.4183 16.4183 23 12 23C7.58172 23 4 19.4183 4 15C4 10.5817 7.58172 7.00002 12 7.00002ZM12 9.00002C8.68629 9.00002 6 11.6863 6 15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15C18 11.6863 15.3137 9.00002 12 9.00002ZM12 10.5L13.3225 13.1797L16.2798 13.6094L14.1399 15.6953L14.645 18.6406L12 17.25L9.35497 18.6406L9.86012 15.6953L7.72025 13.6094L10.6775 13.1797L12 10.5ZM18 2.00002V5.00002L16.6366 6.13758C15.5305 5.55773 14.3025 5.17887 13.0011 5.04951L13 1.99902L18 2.00002ZM11 1.99902L10.9997 5.04943C9.6984 5.17866 8.47046 5.55738 7.36441 6.13706L6 5.00002V2.00002L11 1.99902Z"></path>
                                </svg>
                                Olympic Medals
                              </a>
                              <a className="flex text-base text-indigo-700">
                                <svg
                                  className="mt-1 mr-3"
                                  stroke="currentColor"
                                  fill="none"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  ></path>
                                  <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
                                </svg>
                                Github Stars
                              </a>
                              <a className="flex text-base text-indigo-700">
                                <svg
                                  className="mt-1 mr-3"
                                  stroke="currentColor"
                                  fill="none"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  ></path>
                                  <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                                  <path d="M8 7l4 6l4 -6"></path>
                                  <path d="M12 17l0 -4"></path>
                                </svg>
                                Y Combinator Startups
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Importfile;
