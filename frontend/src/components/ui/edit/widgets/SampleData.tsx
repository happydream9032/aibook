"use client";
import axios from "axios";
import Image from "next/image";
import ResultTable from "./ResultTable";
import { useState, useEffect } from "react";
import { exportParquet } from "duckdb-wasm-kit";
import { insertFile } from "duckdb-wasm-kit";
import { exportArrow } from "duckdb-wasm-kit";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setChangeDuckBookData } from "@/redux/features/navbar-slice";

import MoreViewIcon from "@/assets/images/icons/MoreView.svg";

const SampleData = (props: {
  type: any;
  index: number;
  db: any;
  getSelectedComponentData: (data: any) => void;
}) => {
  const dispatch = useAppDispatch();
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);

  const [isComponentNumber, setIsComponentNumber] = useState(props.index);
  const [isSampleType, setIsSampleType] = useState(props.type);
  const [isShowComponent, setIsShowComponent] = useState(true);
  const [isfetchUrl, setIsFetchUrl] = useState("");
  const [tableData, setTableData] = useState({});
  const [downloadFileCount, setDownloadFileCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");
  const [istableshow, setIsTableShow] = useState(false);
  const [isSQLDropMenu, setIsSQLDropMenu] = useState(false);
  const [isSQLQuery, setSQLQuery] = useState("");

  useEffect(() => {
    let fetchUrl = ""
    if (isSampleType.type === 141) {
      fetchUrl = "https://raw.githubusercontent.com/ngshiheng/michelin-my-maps/main/data/michelin_my_maps.csv"
    } else if (isSampleType.type === 142) {
      fetchUrl = "https://raw.githubusercontent.com/corralm/yc-scraper/main/data/2023-02-27-yc-companies.csv"
    } else if (isSampleType.type === 143) {
      fetchUrl = "https://media.githubusercontent.com/media/datablist/sample-csv-files/main/files/organizations/organizations-10000.csv"
    } else if (isSampleType.type === 144) {
      fetchUrl = "https://media.githubusercontent.com/media/datablist/sample-csv-files/main/files/people/people-10000.csv"
    }
    setIsFetchUrl(fetchUrl);

    if (isSampleType.path.filepath === "") {
      handleFetchUrl(fetchUrl);
    } else {
      let isSQLQuery = `SELECT * FROM '${isSampleType.path.table_name}';`;
      let json_tabledata: any = {
        db: props.db,
        type: isSampleType.type,
        index: isComponentNumber,
        isfilename: isSampleType.path.filepath,
        isSQLQuery: isSQLQuery,
        istablename: isSampleType.path.table_name,
        isfilesize: isSampleType.path.filesize,
        isreturn: 0,
      };
      console.log("current db1 is", json_tabledata);
      setSQLQuery(isSQLQuery);
      setTableData(json_tabledata);
      setExportFileName(isSampleType.path.table_name);
      setIsTableShow(true);
    }
  }, [isSampleType]);

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

  const handleFetchUrl = async (url: string) => {
    if (url != "") {
      console.log("step1", url);
      let conn = await props.db.connect();
      let arry = url.split("/");
      let lastElement = arry[arry.length - 1];
      let temp_file = null;

      console.log("step2", lastElement);
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

          await fetch(url)
            .then((response) => response.text())
            .then((csvText) => {
              let rowData = [];
              let array = [];
              // Split the CSV data into rows
              rowData = csvText.split("\n");
              for (let i = 0; i < rowData.length; i++) {
                let temp = rowData[i].split(",");
                array.push(temp);
              }
              table_column = array;
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
            `CREATE TABLE '${lastElement}' AS SELECT * FROM read_parquet('${url}');`
          );
        }
      }

      await getBufferfromFile(lastElement);
      let json_tabledata: any = {
        db: props.db,
        type: isSampleType.type,
        index: isComponentNumber,
        isfilename: url,
        isSQLQuery: `SELECT * FROM '${lastElement}';`,
        istablename: lastElement,
        isfilesize: temp_file.size,
        isreturn: 1,
      };
      setSQLQuery(`SELECT * FROM '${lastElement}';`);
      setExportFileName(lastElement);
      setTableData(json_tabledata);
      setIsTableShow(true);
      conn.close();
    }
  };

  const headercomponent = () => {
    return (
      <div contentEditable={true}
        suppressContentEditableWarning={true}>
        {
          isSampleType.type === 141 ? (<div className="py-2 w-full flex-col"><h3 className="mb-1 text-xl">Michelin Restaurants</h3><p className="mt-1 text-base">A dataset of restaurants curated from the MICHELIN Guide. [Source: Jerry Ng (<a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/ngshiheng/michelin-my-maps">Github</a>)]</p></div>
          ) : isSampleType.type === 142 ? (<div className="py-2 w-full flex-col"><h3 className="mb-1 text-xl">Y Combinator Startups</h3><p className="mt-1 text-base">All startups in the <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.ycombinator.com/companies/">YC Startup Directory</a> as of Feb 2023. [Source: Miguel Corral Jr. (<a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/corralm/yc-scraper">Github</a>)]</p></div>
          ) : isSampleType.type === 143 ? (<div className="py-2 w-full flex-col"><h3 className="mb-1 text-xl">Business Origanizations</h3><p className="mt-1 text-base">A dataset of from the world<a target="_blank" rel="noopener noreferrer nofollow" href="https://media.githubusercontent.com/media/datablist/sample-csv-files/main/files/organizations/organizations-10000.csv">business organizations</a> as of Feb 2020. [Source: Organization dataset by(<a target="_blank" rel="noopener noreferrer nofollow" href="https://www.datablist.com/learn/csv/download-sample-csv-files">Datablist.</a>)]</p></div>
          ) : isSampleType.type === 144 ? (<div className="py-2 w-full flex-col"><h3 className="mb-1 text-xl">People Dataset</h3><p className="mt-1 text-base">A dataset of from the <a target="_blank" rel="noopener noreferrer nofollow" href="https://media.githubusercontent.com/media/datablist/sample-csv-files/main/files/people/people-10000.csv">peoples</a> that generated by AI. [Source: People dataset by(<a target="_blank" rel="noopener noreferrer nofollow" href="https://media.githubusercontent.com/media/datablist/sample-csv-files/main/files/people/people-10000.csv">Datablist.</a>)]</p></div>
          ) : (<div></div>)
        }
      </div>
    )
  }

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

  return (
    <div>
      {istableshow ? (
        <div className="my-6 flex flex-col overflow-revert rounded-lg border border-indigo-700 w-full right-1 shadow"
          onClick={() => {
            let data: any = {
              type: isSampleType.type,
              path: {
                table_name: tableData["istablename"],
                file_path: tableData["isfilename"],
                file_size: tableData["isfilesize"],
              },
            };
            props.getSelectedComponentData(data);
          }}>
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
        </div >
      ) : (
        <div data-node-view-wrapper="">
          {headercomponent()}
          {isShowComponent && (<div className="select-none flex flex-col">
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
                    disabled
                    id="mantine-kqnsv420g-tab-file"
                    aria-selected="false"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <span className="font-semibold text-sm text-gray-900">
                      Import file
                    </span>
                  </button>
                  <button
                    className="py-2 hover:bg-gray-100 focus:bg-indigo-50 aria-selected:font-semibold aria-selected:text-indigo-500 outline-0"
                    type="button"
                    role="tab"
                    disabled
                    id="mantine-kqnsv420g-tab-url"
                    aria-selected="false"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <span className="font-semibold text-sm text-indigo-500">
                      Fetch Url
                    </span>
                  </button>
                  <button
                    className="py-2 hover:bg-gray-100 focus:bg-indigo-50 aria-selected:font-semibold aria-selected:text-indigo-500 outline-0"
                    type="button"
                    role="tab"
                    disabled
                    id="mantine-kqnsv420g-tab-paste"
                    aria-selected="false"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <span className="font-semibold text-sm text-gray-900">
                      Paste Table
                    </span>
                  </button>
                  <button
                    className="py-2 hover:bg-gray-100 focus:bg-indigo-50 aria-selected:font-semibold aria-selected:text-indigo-500 outline-0"
                    type="button"
                    role="tab"
                    id="mantine-kqnsv420g-tab-examples"
                    aria-selected="true"
                    tabIndex={0}
                    data-active="true"
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <span className="font-semibold text-sm text-gray-900">
                      Example
                    </span>
                  </button>
                </div>

                <div className="flex flex-1 justify-end">
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
                          disabled
                          placeholder=" Paste a URL to a file"
                          value={isfetchUrl}
                          onChange={(e) => {
                            e.preventDefault();
                          }}
                        />
                        <button
                          className="ml-2 bg-indigo-600 text-sm text-white py-2 px-7 rounded-md"
                          disabled
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          Loading
                        </button>
                      </div>
                      <span className="flex-col items-center justify-center block text-sm font-small text-indigo-400">
                        Loading ....
                      </span>
                      <span className="flex-col items-center justify-center block text-sm font-small text-gray-400">
                        CSV, Parquet, or Arrow
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>)}

        </div>)}
    </div>
  );
}

export default SampleData;