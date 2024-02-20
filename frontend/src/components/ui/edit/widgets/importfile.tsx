import axios from "axios";
import Image from "next/image";
import ResultTable from "./ResultTable";
import { useState, useEffect } from "react";
import { insertFile } from "duckdb-wasm-kit";
import { exportArrow } from "duckdb-wasm-kit";
import { exportParquet } from "duckdb-wasm-kit";
import { setChangeDuckBookData } from "@/redux/features/navbar-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import MoreViewIcon from "@/assets/images/icons/MoreView.svg";
import CloseDialogIcon from "@/assets/images/icons/CloseDialog.svg";
import MichelinRestaurantIcon from "@/assets/images/icons/MichaelRestaurant.svg";
import YCombinarStartupIcon from "@/assets/images/icons/YCombinatorIcon.svg";
import SampleDataIcon from "@/assets/images/icons/SampleData.svg";

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
  const [isMinIOTab, setIsMinIoTab] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [isFetchurl, setIsFetchUrl] = useState("");
  const [isBucketName, setIsBucketName] = useState("");
  const [isFileName, setIsFileName] = useState("");
  const [isAccessKey, setIsAccessKey] = useState("");
  const [isSecretKey, setIsSecretKey] = useState("")
  const [isTableShow, setIsTableShow] = useState(false);
  const [isTableData, setTableData] = useState<element_type>({
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
  const [isExportFileName, setExportFileName] = useState("");
  const [isSQLQuery, setSQLQuery] = useState("");
  const [isDownloadFileCount, setDownloadFileCount] = useState(0);
  const [isSQLDropMenu, setIsSQLDropMenu] = useState(false);

  useEffect(() => {
    let type = isComponentType;
    if (type.type === 11 || type.type === 12 || type.type === 14 || type.type === 15) {
      let isSQLQuery = `SELECT * FROM '${type.path.tablename}';`;
      let json_tabledata: any = {
        db: props.db,
        type: type.type,
        index: isComponentNumber,
        isfilename: type.path.filepath,
        isSQLQuery: isSQLQuery,
        istablename: type.path.tablename,
        isfilesize: type.path.filesize,
        isreturn: 0,
      };
      setSQLQuery(isSQLQuery);
      setTableData(json_tabledata);
      setExportFileName(type.path.tablename);
      setIsTableShow(true);
    }
  }, [duckbook]);


  const getBufferfromFile = async (imagefile: any) => {
    try {
      if (imagefile != null) {
        console.log(imagefile.name);
        let formData = new FormData();
        formData.append('file', imagefile);

        let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/uploads";
        await axios
          .post(update_apiUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => {
            if (response.data.code === 200) {
              console.log("new file is uploaded");
            }
          })
          .catch((error) => {
            console.error("Error19:", error.message);
            // Handle the error
          });
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
        // if (csvfile.name.includes(".csv") || csvfile.name.includes(".CSV") || csvfile.name.includes(".parquet") || csvfile.name.includes(".PARQUET") || csvfile.name.includes(".arrow") || csvfile.name.includes(".ARROW")) {
        //   await insertFile(props.db, csvfile, csvfile.name);
        // }
        await insertFile(props.db, csvfile, csvfile.name);
        await getBufferfromFile(csvfile);
      }


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
    if (isFetchurl != "") {
      let conn = await props.db.connect();
      let arry = isFetchurl.split("/");
      let lastElement = arry[arry.length - 1];
      let temp_file: any = null;

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

          await fetch(isFetchurl)
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
            `CREATE TABLE '${lastElement}' AS SELECT * FROM read_parquet('${isFetchurl}');`
          );
        }
      }

      await getBufferfromFile(temp_file);
      let json_tabledata: any = {
        db: props.db,
        type: 12,
        index: isComponentNumber,
        isfilename: isFetchurl,
        isSQLQuery: `SELECT * FROM '${lastElement}';`,
        istablename: lastElement,
        isfilesize: temp_file.size,
        isreturn: 1,
      };
      setSQLQuery(`SELECT * FROM '${lastElement}';`);
      setTableData(json_tabledata);
      setExportFileName(lastElement);
      setIsTableShow(true);
      conn.close();
    }
  };

  const handlePasteTable = async (data: string) => {
    let stringTableData = data;
    if (stringTableData != "") {
      let tablename = "pastTable";
      let conn = await props.db.connect();
      let file: any = null;
      let table_count_query = await conn.query(
        `SELECT * FROM information_schema.tables WHERE TABLE_NAME LIKE '${tablename}';`
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
        await insertFile(props.db, file, tablename);
      }

      await getBufferfromFile(file);
      let json_tabledata: any = {
        db: props.db,
        type: 13,
        index: isComponentNumber,
        isfilename: "data" + String(table_count) + ".csv",
        isSQLQuery: `SELECT * FROM '${tablename}';`,
        istablename: tablename,
        isfilesize: file.size,
        isreturn: 1,
      };
      setExportFileName(tablename);
      setTableData(json_tabledata);
      setIsTableShow(true);
      conn.close();
    }
  };

  const downloadFile = async (type: number) => {
    let conn = await props.db.connect();
    let query = isSQLQuery.replaceAll(";", "");

    let temp = isExportFileName.split(".");
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
      let filename1 = original_filename + String(isDownloadFileCount) + ".csv";
      conn.query(`COPY (${query}) TO '${filename1}' (HEADER, DELIMITER ',');`);
      const buffer = await props.db.copyFileToBuffer(filename1);
      const blob = new Blob([buffer], { type: "text/csv" });
      const file = new File([blob], "data.csv", {
        type: "text/csv",
        lastModified: Date.now(),
      });
      setDownloadFileCount(isDownloadFileCount + 1);

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

  const deleteComponent = async (index: number, id: number) => {
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

  const getFileFromMinIO = async () => {
    try {
      if (isBucketName !== "" && isFileName !== "") {
        let select_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/miniofiles";
        let response = await axios.get(select_apiUrl, {
          params: {
            ACCESSKEY: isAccessKey,
            SECRETKEY: isSecretKey,
            BUCKETNAME: isBucketName,
            FILENAME: isFileName
          },
          responseType: 'blob' // Ensure the response is treated as a Blob
        });

        let type = "";
        if (String(isFileName).includes(".csv") || String(isFileName).includes(".CSV")) {
          type = "text/csv";
        } else if (String(isFileName).includes(".parquet") || String(isFileName).includes(".PARQUET")) {
          type = "application/vnd.apache.parquet";
        } else if (String(isFileName).includes(".arrow") || String(isFileName).includes(".ARROW")) {
          type = "application/vnd.apache.arrow.file";
        }
        console.log("uploading file type is", type);
        let blob = new Blob([response.data], { type: type });
        let file = new File([blob], isFileName, {
          type: type,
          lastModified: Date.now(),
        });

        let conn = await props.db.connect();
        let table_count_query = await conn.query(
          `SELECT * FROM information_schema.tables WHERE TABLE_NAME LIKE '${isFileName}';`
        );
        let table_count_array = table_count_query._offsets;
        let table_count = table_count_array[table_count_array.length - 1];
        if (Number(table_count) == 0) {
          await insertFile(props.db, file, isFileName);
        }

        await getBufferfromFile(file);
        let json_tabledata: any = {
          db: props.db,
          type: 15,
          index: isComponentNumber,
          isfilename: isFileName,
          isSQLQuery: `SELECT * FROM '${isFileName}';`,
          istablename: isFileName,
          isfilesize: file.size,
          isreturn: 1,
        };
        setExportFileName(isFileName);
        setSQLQuery(`SELECT * FROM '${isFileName}';`);
        setTableData(json_tabledata);
        setIsTableShow(true);
        conn.close();
      }

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  return (
    <div>
      {isShowComponent && (
        <div
          onClick={() => {
            let data: any = {
              type: isTableData["type"],
              path: {
                tablename: isTableData.istablename,
                file_path: isTableData.isfilename,
                file_size: isTableData.isfilesize,
              },
            };
            props.getSelectedComponentData(data);
          }}
        >
          {isTableShow ? (
            <div className="my-6 flex flex-col overflow-revert rounded-lg border border-indigo-700 w-full right-1 shadow">
              <ResultTable data={isTableData} />
              <div className="flex h-[30px] items-center my-2">
                <div className="px-2 w-full flex items-center justify-between">
                  <input
                    className="flex-1 mb-2 text-sm text-gray-500 border border-transparent focus:outline-none"
                    value={isExportFileName}
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
                                  deleteComponent(props.index, duckbook["ID"]);
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
                          setIsMinIoTab(false);
                          setIsImportTab(true);
                          setIsFetchTab(false);
                          setIsPasteTableTab(false);
                          setIsExampleTab(false);
                        }}
                      >
                        <span className={`${isImportTab ? "text-indigo-500" : "text-gray-900"} font-semibold text-sm`}>Import file</span>
                      </button>
                      <button
                        className="py-2 hover:bg-gray-100 focus:bg-indigo-50 aria-selected:font-semibold aria-selected:text-indigo-500 outline-0"
                        type="button"
                        role="tab"
                        id="mantine-kqnsv420g-tab-url"
                        aria-selected="false"
                        tabIndex={-1}
                        onClick={() => {
                          setIsMinIoTab(false);
                          setIsImportTab(false);
                          setIsFetchTab(true);
                          setIsPasteTableTab(false);
                          setIsExampleTab(false);
                        }}
                      >
                        <span className={`${isFetchTab ? "text-indigo-500" : "text-gray-900"} font-semibold text-sm`}>Fetch Url</span>
                      </button>
                      <button
                        className="py-2 hover:bg-gray-100 focus:bg-indigo-50 aria-selected:font-semibold aria-selected:text-indigo-500 outline-0"
                        type="button"
                        role="tab"
                        id="mantine-kqnsv420g-tab-paste"
                        aria-selected="false"
                        tabIndex={-1}
                        onClick={() => {
                          setIsMinIoTab(false);
                          setIsImportTab(false);
                          setIsFetchTab(false);
                          setIsPasteTableTab(true);
                          setIsExampleTab(false);
                        }}
                      >
                        <span className={`${isPasteTableTab ? "text-indigo-500" : "text-gray-900"} font-semibold text-sm`}>Paste Table</span>
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
                          setIsPasteTableTab(false);
                          setIsExampleTab(false);
                          setIsMinIoTab(true);
                        }}
                      >
                        <span className={`${isMinIOTab ? "text-indigo-500" : "text-gray-900"} font-semibold text-sm`}>From MinIO</span>
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
                          setIsMinIoTab(false);
                          setIsPasteTableTab(false);
                          setIsExampleTab(true);
                        }}
                      >
                        <span className={`${isPasteTableTab ? "text-indigo-500" : "text-gray-900"} font-semibold text-sm`}>Example</span>
                      </button>
                    </div>

                    <div className="flex flex-1 justify-end">
                      {isImportTab && (
                        <div
                          className="relative flex flex-col w-full p-4 gap-4"
                          role="tabpanel"
                          id="mantine-kqnsv420g-panel-file"
                          aria-labelledby="mantine-kqnsv420g-tab-file"
                        >
                          <button
                            className="absolute right-4 top-4"
                            type="button"
                            tabIndex={-1}
                            title={""}
                            onClick={() => {
                              deleteComponent(props.index, duckbook["ID"]);
                              setIsShowComponent(false);
                            }}
                          >
                            <Image
                              src={CloseDialogIcon}
                              alt=""
                              width="20"
                              height="20"
                            />
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
                              {isLoading1 ? (
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
                              deleteComponent(props.index, duckbook["ID"]);
                              setIsShowComponent(false);
                            }}
                          >
                            <Image
                              src={CloseDialogIcon}
                              alt=""
                              width="20"
                              height="20"
                            />
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
                                {isLoading2 ? "Loading" : "Load"}
                              </button>
                            </div>
                            {isLoading2 && (
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
                              deleteComponent(props.index, duckbook["ID"]);
                              setIsShowComponent(false);
                            }}
                          >
                            <Image
                              src={CloseDialogIcon}
                              alt=""
                              width="20"
                              height="20"
                            />
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
                            <Image
                              src={CloseDialogIcon}
                              alt=""
                              width="20"
                              height="20"
                            />
                          </button>
                          <h5 className="font-bold">Examples</h5>
                          <div className="text-gray-400">
                            Get started fast with an example dataset
                          </div>
                          <div className="w-full flex flex-col justify-center rounded-lg min-h-[156px] p-2 gap-2">
                            <a className="flex text-base text-indigo-700">
                              <Image
                                src={MichelinRestaurantIcon}
                                alt=""
                                width="20"
                                height="20"
                              />
                              Michelin Star Restaurants
                            </a>
                            <a className="flex text-base text-indigo-700">
                              <Image
                                src={YCombinarStartupIcon}
                                alt=""
                                width="20"
                                height="20"
                              />
                              Y Combinator Startups
                            </a>
                            <a className="flex text-base text-indigo-700">
                              <Image
                                src={SampleDataIcon}
                                alt=""
                                width="20"
                                height="20"
                              />
                              Business Origination
                            </a>
                            <a className="flex text-base text-indigo-700">
                              <Image
                                src={SampleDataIcon}
                                alt=""
                                width="20"
                                height="20"
                              />
                              People Dataset
                            </a>
                          </div>
                        </div>
                      )}
                      {isMinIOTab && (
                        <div
                          className="relative flex flex-col w-full p-4 gap-4"
                          role="tabpanel"
                        >
                          <button
                            className="absolute right-4 top-4"
                            type="button"
                            tabIndex={-1}
                            title={""}
                            onClick={() => {
                              // deleteComponent(props.index, duckbook["ID"]);
                              setIsShowComponent(false);
                            }}
                          >
                            <Image
                              src={CloseDialogIcon}
                              alt=""
                              width="20"
                              height="20"
                            />
                          </button>
                          <h5 className="font-bold">From S3</h5>
                          <div className="text-gray-400">
                            Load a file from S3 (CSV, Parquet, or Arrow)
                          </div>
                          <div className="w-full flex flex-col justify-center rounded-lg min-h-[156px] p-3 gap-2 border border-[#e0e0e0]">
                            <span className="flex justify-start w-full">Access_key :</span>
                            <input
                              className="flex text-sm w-full border rounded-md border-gray-600 p-1 focus:border-indigo-500"
                              type="text"
                              placeholder="Paste a access key of S3 bucket"
                              onChange={(e) => {
                                e.preventDefault();
                                setIsAccessKey(e.currentTarget.value);
                              }}
                            />
                            <span className="mt-1 flex justify-start w-full">Secret_key :</span>
                            <input
                              className="flex text-sm w-full border rounded-md border-gray-600 p-1 focus:border-indigo-500"
                              type="text"
                              placeholder="Paste a secret key of S3 bucket"
                              onChange={(e) => {
                                e.preventDefault();
                                setIsSecretKey(e.currentTarget.value);
                              }}
                            />
                            <span className="mt-1 flex justify-start w-full">BucketName :</span>
                            <input
                              className="flex text-sm w-full border rounded-md border-gray-600 p-1 focus:border-indigo-500"
                              type="text"
                              placeholder="Paste a name of S3 bucket"
                              onChange={(e) => {
                                e.preventDefault();
                                setIsBucketName(e.currentTarget.value);
                              }}
                            />
                            <span className="mt-1 flex justify-start w-full">FileName :</span>
                            <input
                              className="flex text-sm w-full border rounded-md border-gray-600 p-1 focus:border-indigo-500"
                              type="text"
                              placeholder="Paste a name of S3 filename"
                              onChange={(e) => {
                                e.preventDefault();
                                setIsFileName(e.currentTarget.value);
                              }}
                            />
                            <div className="flex justify-end">
                              <button
                                className="ml-2 mt-1 text-center bg-indigo-600 text-sm text-white py-2 px-7 rounded-md"
                                onClick={(e) => {
                                  e.preventDefault();
                                  getFileFromMinIO();
                                  setIsLoading3(true);
                                }}
                              >
                                {isLoading3 ? "Loading" : "Load"}
                              </button>
                            </div>

                          </div>
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
  );
};

export default Importfile;
