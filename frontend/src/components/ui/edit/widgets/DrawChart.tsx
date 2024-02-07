
import { useEffect, useRef, useState } from 'react';
import ChartComponent from "../../chart";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useDuckDb } from "duckdb-wasm-kit";
import { removeDuplicates, countItems } from '@/util/temp';

interface element_type {
  type: number;
  value: string;
  path: {
    table_name: string;
    filepath: string;
    filesize: string;
  };
}

const DrawChart = (props: {
  type: any;
  index: number;
  db: any;
  getSelectedComponentData: (data: any) => void;
}) => {
  const { db } = useDuckDb();
  const dispatch = useAppDispatch();
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);

  const [isShowComponent, setIsShowComponent] = useState(false);
  const [isChartData, setChartData] = useState({});
  const [isSchema, setIsSchema] = useState<element_type[]>({ type: "", value: "", path: { table_name: "", filepath: "", filesize: "" } });
  const [isTableName, setIsTableName] = useState("");
  const [isTableNameArray, setIsTableNameArray] = useState<String[]>([]);
  const [isX_AxisItem, setIsX_AxisItem] = useState("");
  const [isX_AxisItemArray, setIsX_AxisItemArray] = useState<String[]>([]);
  const [isY_AxisItem, setIsY_AxisItem] = useState("Row Count");
  const [isSortType, setIsSortType] = useState(0);
  const [isLimit, setIsLimit] = useState(0);
  const [isChartTitle, setIsChartTitle] = useState("");
  const [isChartSubTitle, setIsChartSubTitle] = useState("");
  const [isX_AxisTitle, setIsX_AxisTitle] = useState("");
  const [isY_AxisTitle, setIsY_AxisTitle] = useState("Row Count");
  const [isChartType, setIsChartType] = useState("");
  const [isChartTitles, setIsChartTitles] = useState();

  useEffect(() => {
    let table_name = "";
    let array = JSON.parse(duckbook["DATA"]);
    array.splice(0, 1);
    array.map((item: any, index: number) => {
      if (item == null) {
        array.splice(index, 1);
      } else {
        if (item.path.table_name !== "") {
          table_name = item.path.table_name;
        }
      }
    })
    setIsSchema(array);
    console.log("final table name is", table_name, array);
    InitialDataSet(array, 0, 1);
  }, []);

  const InitialDataSet = async (array: any, Tindex: number, Rindex: number) => {
    let conn = await props.db.connect();
    let get_query = "";
    console.log("isSchema[Tindex] is", array);
    if (array[Tindex].type !== 2 && array[Tindex].type !== 3 && array[Tindex].type !== 4) {
      get_query = `SELECT * FROM '${array[Tindex].path.table_name}';`;
    } else {
      if (array[Tindex].value !== "") {
        if (array[Tindex].type === 2) {
          get_query = array[Tindex].value
        } else if (array[Tindex].type === 4) {
          let temp = JSON.parse(array[Tindex].value);
          get_query = temp.query;
        }
      }
    }
    let get_table_data = await conn.query(get_query);
    let output = [...get_table_data].map((c) =>
      Object.keys(c).reduce(
        (acc, k) => (k ? { ...acc, [k]: `${c[k]}` } : acc),
        {} as CellInfo
      )
    );
    // get array of row items
    let header_titles = Object.keys(output[0]);
    let remove_duplicated_array = removeDuplicates(header_titles);
    setIsX_AxisItemArray(remove_duplicated_array);
    setIsX_AxisItem(remove_duplicated_array[Rindex]);
    // get column data with row item
    let body_items: any = [];
    output.map((item: any, index: number) => {
      Object.values(item).map((value: any, index: number) => {
        if (index === Rindex) {
          body_items.push(value);
        }
      })
    });
    // remove same data of array
    let dataset = countItems(body_items);
    console.log("dataset is", dataset);
    let chart_titles: any = {
      title: "Titile",
      subtitle: "subTitle",
      Y_Axis: "Row Count",
      X_Axis: header_titles[Rindex]
    }
    setIsChartTitles(chart_titles);
    setChartData(dataset);
    setIsShowComponent(true);
  }

  // const handleRightSidebar = () => {

  // }

  return (
    <div>
      {isShowComponent &&
        (<div className="relative">
          <div className={"border border-indigo-500 px-5 py-3 rounded-lg mb-5 relative"}>
            <div className="w-full h-full">
              <ChartComponent data={isChartData} titles={isChartTitles} />
            </div>
          </div>
        </div>)}
    </div>
  );
}
export default DrawChart;