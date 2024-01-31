import axios from "axios";
import { useState, useEffect } from "react";
import { Column, Table } from "react-virtualized";
import { setChangeDuckBookData } from "@/redux/features/navbar-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import "react-virtualized/styles.css";

const ResultTable = (props: {
  data: any;
  setEnableButton: (type: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);

  const [isShowLess, setIsShowLess] = useState(false);
  const [isTableTitle, setTableTitle] = useState([]);
  const [isTableData, setTableData] = useState([]);
  const [isModalShow, setIsModalShow] = useState(false);
  const [tableRowCount, setTableRowCount] = useState(0);
  const [tableColumnCount, setTableColumnCount] = useState(0);
  const [exportFilePath, setExportFilePath] = useState("");
  const [isLoadingError, setIsLoadingError] = useState(false);

  useEffect(() => {
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

  const gettabledata = async () => {
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
      for (let i = 0; i < header_titles.length; i++) {
        let temp_header_item = header_titles[i];
        if (temp_header_item.length > 10) {
          temp_header_item = temp_header_item.slice(0, 10) + "...";
          header_titles[i] = temp_header_item;
        }
      }

      let body_table: any = [];
      output.map((item: any, index: number) => {
        let body_temp: any = {};
        body_temp["id"] = index + 1;
        Object.values(item).map((value: any, index1: number) => {
          if (String(value).length > 10) {
            let temp_header_item: string = value.slice(0, 10) + "...";
            body_temp[header_titles[index1]] = temp_header_item;
          } else {
            body_temp[header_titles[index1]] = String(value);
          }
        });
        body_table.push(body_temp);
      });
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
      }
      item["type"] = props.data.type;
      item["path"]["table_name"] = props.data.istablename;
      item["path"]["filepath"] = props.data.isfilename;
      item["path"]["filesize"] = props.data.isfilesize;

      array[props.data.index] = item;
      dispatch(setChangeDuckBookData(JSON.stringify(array)));

      await saveDuckDBData(JSON.stringify(array));
      console.log(body_table);
      setTableTitle(header_titles);
      setTableData(body_table);
      setTableRowCount(output.length);
      setTableColumnCount(header_titles.length);
      setExportFilePath(props.data.isfilename);
      setIsLoadingError(false);
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
        // <div
        //   role="alert"
        //   className="relative w-full mt-1 p-2 pl-11 translate-y-[-3px] border-destructive/50 text-destructive dark:border-destructive text-destructive border-2 bg-red-50 rounded-md rounded-t-none"
        // >
        //   <h5 className="mb-1 font-medium leading-none tracking-tight">
        //     Oops!
        //   </h5>
        //   <div className="text-sm [&amp;_p]:leading-relaxed whitespace-pre-wrap">
        //     Loading data is failure!
        //   </div>
        // </div>
        <div>
          <div
            className="relative"
            onClick={() => {
              // setShowModal()
              console.log("sdfsdfds");
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
              className={`${
                isShowLess ? "h-[250px] " : "h-[420px] "
              } outline-none overflow-x-scroll relative`}
            >
              <div className="w-full h-full absolute">
                {isShowLess ? (
                  <Table
                    width={200 * isTableTitle.length}
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
                        width={200}
                      />
                    ))}
                  </Table>
                ) : (
                  <Table
                    width={200 * isTableTitle.length}
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
                        width={200}
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
      )}
    </div>
  );
};

export default ResultTable;
