
import { useEffect, useRef, useState } from 'react';
import ChartComponent from "../../chart";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useDuckDb } from "duckdb-wasm-kit";
import { removeDuplicates, countItems, sortbyValue, sortbyKey, reverseArray, extractJson_TopNumber, convertStringKeyJson } from '@/util/temp';

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
  chart_type: number;
  getSelectedComponentData: (data: any) => void;
}) => {
  const { db } = useDuckDb();
  const dispatch = useAppDispatch();
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);

  const [isShowComponent, setIsShowComponent] = useState(false);
  const [isChartData, setChartData] = useState({});
  const [isSchema, setIsSchema] = useState<element_type[]>({ type: "", value: "", path: { table_name: "", filepath: "", filesize: "" } });
  const [isTableName, setIsTableName] = useState(0);
  const [isTableNameArray, setIsTableNameArray] = useState(null);
  const [isX_AxisItem, setIsX_AxisItem] = useState(0);
  const [isX_AxisItemArray, setIsX_AxisItemArray] = useState<String[]>([]);
  const [isY_AxisItem, setIsY_AxisItem] = useState("Row Count");
  const [isSortType, setIsSortType] = useState(0);
  const [isLimit, setIsLimit] = useState(3);
  const [isChartTitle, setIsChartTitle] = useState("");
  const [isChartSubTitle, setIsChartSubTitle] = useState("");
  const [isX_AxisTitle, setIsX_AxisTitle] = useState("");
  const [isY_AxisTitle, setIsY_AxisTitle] = useState("Row Count");
  const [isChartType, setIsChartType] = useState(props.chart_type);
  const [isChartTitles, setIsChartTitles] = useState();

  useEffect(() => {
    let array = JSON.parse(duckbook["DATA"]);
    array.splice(0, 1);

    let source_array: any = [];
    array.map((item: any, index: number) => {
      if (item == null) {
        array.splice(index, 1);
      } else {
        if (item.path.table_name !== "") {
          source_array.push(item.path.table_name);
        } else {
          array.splice(index, 1);
        }
      }
    })
    let table_index = source_array.length - 1
    setIsTableNameArray(source_array);
    setIsSchema(array);
    setIsTableName(source_array.length - 1);
    console.log("final table name is", source_array.length - 1, source_array);
    InitialDataSet(array, table_index);
  }, []);

  const InitialDataSet = async (array: any, index: number) => {
    let conn = await props.db.connect();
    let get_query = "";
    console.log("isSchema[Tindex] is", array, index);
    if (array[index].type !== 2 && array[index].type !== 3 && array[index].type !== 4) {
      get_query = `SELECT * FROM '${array[index].path.table_name}';`;
    } else {
      if (array[index].value !== "") {
        if (array[index].type === 2) {
          get_query = array[index].value
        } else if (array[index].type === 4) {
          let temp = JSON.parse(array[index].value);
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

    // get column data with row item
    let body_items: any = [];
    output.map((item: any, index: number) => {
      Object.values(item).map((value: any, index: number) => {
        if (index === isX_AxisItem) {
          body_items.push(value);
        }
      })
    });

    let dataset = countItems(body_items);
    let string_dataset = convertStringKeyJson(dataset)
    if (isLimit === 0) {
      SortArray(extractJson_TopNumber(string_dataset, 10));
    } else if (isLimit === 1) {
      SortArray(extractJson_TopNumber(string_dataset, 100));
    } else if (isLimit === 2) {
      SortArray(extractJson_TopNumber(string_dataset, 1000));
    } else if (isLimit === 3) {
      SortArray(string_dataset);
    }
    // remove same data of array
    console.log("dataset is", dataset);
    let chart_titles: any = {
      title: isChartTitle,
      subtitle: isChartSubTitle,
      Y_Axis: isY_AxisTitle,
      X_Axis: remove_duplicated_array[isX_AxisItem]
    }
    setIsX_AxisTitle(remove_duplicated_array[isX_AxisItem])
    setIsX_AxisItemArray(remove_duplicated_array);
    setIsChartTitles(chart_titles);
    setIsShowComponent(true);
  }

  const SortArray = (limited_dataset: any) => {
    if (isSortType === 0) {  //sort by AZ
      setChartData(sortbyKey(limited_dataset));
    } else if (isSortType === 1) {
      let temp = sortbyKey(limited_dataset);
      setChartData(reverseArray(temp));
    } else if (isSortType === 2) {
      setChartData(sortbyValue(limited_dataset));
    } else if (isSortType === 3) {
      let temp = sortbyValue(limited_dataset);
      setChartData(reverseArray(temp));
    }
  }

  const handleRightSidebar = (data: any) => {
    setIsChartTitle(data.title);
    setIsChartSubTitle(data.subTitle);
    setIsX_AxisTitle(data.xAxisTitle);
    setIsY_AxisTitle(data.yAxisTitle);
    setIsTableName(data.source);
    setIsChartType(data.isChartType);
    setIsX_AxisItem(data.xAxisValue);
    setIsSortType(data.sort_Type);
    setIsLimit(data.limit_Type)
    InitialDataSet(isSchema, data.source);
  }

  return (
    <div>
      {isShowComponent &&
        (<div className="relative" onClick={() => {
          let data: any = {
            title: isChartTitle,
            subTitle: isChartSubTitle,
            xAxisTitle: isX_AxisTitle,
            yAxisTitle: isY_AxisTitle,
            xAxisArray: isX_AxisItemArray,
            SourceArray: isTableNameArray,
            source: isTableName,
            barValue: isChartType,
            xAxisValue: isX_AxisItem,
            sort_Type: isSortType,
            limit_Type: isLimit
          };
          props.getSelectedComponentData(data);
        }}>
          <div className={"border border-indigo-500 px-5 py-3 rounded-lg mb-5 relative"}>
            <div className="w-full h-full">
              <ChartComponent data={isChartData} titles={isChartTitles} chart_type={isChartType} />
            </div>
          </div>
        </div>)}
    </div>
  );
}
export default DrawChart;