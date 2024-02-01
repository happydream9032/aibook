import axios from "axios";
import { useDuckDb } from "duckdb-wasm-kit";
import { useState, useEffect } from "react";
import { Column, Table, AutoSizer } from "react-virtualized";
import { setChangeDuckBookData } from "@/redux/features/navbar-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import "react-virtualized/styles.css";

const ResultTable = (props: {
  data: any;
  // setEnableButton: (type: boolean) => void;
}) => {
  const { db, loading, error } = useDuckDb();
  const dispatch = useAppDispatch();
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);
  const [isTableShow, setIsTableShow] = useState(false);
  const [isShowLess, setIsShowLess] = useState(false);
  const [isTableTitle, setTableTitle] = useState([]);
  const [isTableData, setTableData] = useState([]);
  const [isModalShow, setIsModalShow] = useState(false);
  const [tableRowCount, setTableRowCount] = useState(0);
  const [tableColumnCount, setTableColumnCount] = useState(0);
  const [exportFilePath, setExportFilePath] = useState("");
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [isColumnLengthArray, setIsColumnLengthArray] = useState<Array<number>>([]);
  const [isColumnTotalLength, setIsColumnTotalLength] = useState(0);

  useEffect(() => {
    console.log(props.data);
    gettabledata();
  }, []);

  const saveDuckDBData = async (value: string) => {
    let data = {
      DATA: value,
      ID: duckbook["ID"],
    };
    let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/changedbdata";
    await axios
      .post(update_apiUrl, data)
      .then((response) => {
        console.log("update response is", response.data);
      })
      .catch((error) => {
        console.error("Error19:", error.message);
        // Handle the error
      });
  };

  const setComponetType = async (temp_data: any) => {
    let array = JSON.parse(temp_data[0][4]);
    let item = {
      type: 0,
      value: "",
      path: {
        table_name: "",
        filepath: "",
        filesize: "",
      },
    };
    console.log(props.data.type);
    if (props.data.type === 11) {
      item["value"] = "";
    } else if (props.data.type === 12) {
      item["value"] = "";
    } else if (props.data.type === 13) {
      item["value"] = "";
    } else if (props.data.type === 2) {
      item["value"] = props.data.isSQLQuery;
    } else if (props.data.type === 4) {
      item["value"] = props.data.isPrompt;
    } else if (props.data.type === 141) {
      item["value"] = props.data.isPrompt;
    } else if (props.data.type === 142) {
      item["value"] = props.data.isPrompt;
    } else if (props.data.type === 143) {
      item["value"] = props.data.isPrompt;
    } else if (props.data.type === 144) {
      item["value"] = props.data.isPrompt;
    }
    item["type"] = props.data.type;
    item["path"]["table_name"] = props.data.istablename;
    item["path"]["filepath"] = props.data.isfilename;
    item["path"]["filesize"] = props.data.isfilesize;

    array[props.data.index] = item;
    dispatch(setChangeDuckBookData(JSON.stringify(array)));

    await saveDuckDBData(JSON.stringify(array));
  };
  const gettabledata = async () => {
    console.log("11111111111111111111");
    try {
      let data = {
        HASH: duckbook["HASH"],
      };
      let temp_data: any = [];
      let select_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/getdbbyhash";
      await axios
        .post(select_apiUrl, data)
        .then((response) => {
          console.log("response is", response.data);
          response.data.map((item: any) => {
            temp_data.push(item);
          });
        })
        .catch((error) => {
          console.error("Error20:", error.message);
          // Handle the error
        });
      console.log("sql", props.data.isSQLQuery);
      let db = props.data.db;
      let conn = await db.connect();
      let check_table = await conn.query(props.data.isSQLQuery);

      let output = [...check_table].map((c) =>
        Object.keys(c).reduce(
          (acc, k) => (k ? { ...acc, [k]: `${c[k]}` } : acc),
          {} as CellInfo
        )
      );

      let header_titles: any = Object.keys(output[0]);
      console.log("header", header_titles);
      let length_array: Array<number> = [];
      header_titles.map((item: string, index: number) => {
        length_array.push(String(item).length * 3.5);
      })

      let body_table: any = [];
      output.map((item: any, index: number) => {
        let body_temp: any = {};
        body_temp["id"] = index + 1;
        Object.values(item).map((value: any, index1: number) => {
          if ((String(value).length) * 2 > length_array[index1]) {
            length_array[index1] = (String(value).length) * 2;
          }
        })
        body_table.push(item);
      });
      setIsColumnLengthArray(length_array);

      // set total width of react-virtualized table
      let total_width = 0;
      for (let i = 0; i < length_array.length; i++) {
        total_width = total_width + length_array[i] + 4;
      }
      setIsColumnTotalLength(total_width);
      //
      console.log("<<<<<<<<<<<<<<<<<<<<", length_array, total_width, ">>>>>>>>>>>>>>>>>>>>>>>");

      if (props.data.isreturn == 1) {
        await setComponetType(temp_data);
      }
      console.log(body_table);
      setTableTitle(header_titles);
      setTableData(body_table);
      setTableRowCount(output.length);
      setTableColumnCount(header_titles.length);
      setExportFilePath(props.data.isfilename);
      setIsLoadingError(false);
      setIsTableShow(true);
      // props.setEnableButton(false);
    } catch (err) {
      setIsLoadingError(true);
      // props.setEnableButton(true);
    }
  };

  return (
    <div className="">
      {isLoadingError ? (
        <div></div>
      ) : (
        <div>
          {isTableShow ? (
            <div>
              <div
                className="relative"
                onClick={() => {
                  // setShowModal()
                  setIsModalShow(true);
                }}
              >
                <div className=" pointer-events-none absolute bottom-0 flex h-[80px] w-full items-end justify-center">
                  <button
                    className="px-3 inline-block w-auto relative shadow-sm bg-white text-indigo-500 hover:bg-gray-50 border border-gray-600 rounded-md pointer-events-auto z-[2] m-7"
                    type="button"
                    onClick={() => {
                      setIsShowLess(!isShowLess);
                    }}
                  >
                    <div className="flex items-center justify-center h-full overflow-visible">
                      {isShowLess ? (
                        <span className="h-full overflow-hidden flex items-center">
                          Show more
                        </span>
                      ) : (
                        <span className="h-full overflow-hidden flex items-center">
                          Show less
                        </span>
                      )}
                    </div>
                  </button>
                  <div className=" absolute w-full h-full bg-white opacity-50 z-[1]"></div>
                </div>
                <div
                  className={`${isShowLess ? "h-[250px] " : "h-[420px] "
                    } outline-none overflow-x-scroll relative`}
                >
                  <div className="w-full h-full absolute">
                    {isShowLess ? (
                      <Table
                        width={isColumnTotalLength * 5}
                        height={220}
                        headerHeight={50}
                        rowHeight={50}
                        rowCount={isTableData.length}
                        rowGetter={({ index }) => isTableData[index]}
                      >
                        {isTableTitle.map((item: string, index: number) => (
                          <Column
                            className="text-sm"
                            key={index}
                            label={item}
                            dataKey={item}
                            width={isColumnLengthArray[index] * 5}
                          />
                        ))}
                      </Table>
                    ) : (
                      <Table
                        width={isColumnTotalLength * 5}
                        height={390}
                        headerHeight={50}
                        rowHeight={50}
                        rowCount={isTableData.length}
                        rowGetter={({ index }) => isTableData[index]}
                      >
                        {isTableTitle.map((item: string, index: number) => (
                          <Column
                            className="text-sm"
                            key={index}
                            label={item}
                            dataKey={item}
                            width={isColumnLengthArray[index] * 5}
                          />
                        ))}
                      </Table>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex h-[30px] items-center">
                <div className="px-2 w-full flex items-center justify-end">
                  <span className="text-sm text-gray-300">
                    {tableRowCount} rows × {tableColumnCount} columns
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultTable;
