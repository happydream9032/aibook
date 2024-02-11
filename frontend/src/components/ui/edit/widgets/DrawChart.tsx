
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ChartComponent from "../../chart";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useDuckDb } from "duckdb-wasm-kit";
import { setChangeDuckBookData } from "@/redux/features/navbar-slice";
import { removeDuplicates, countItems, sortbyValue, sortbyKey, reverseArray, extractJson_TopNumber, convertStringKeyJson } from '@/util/temp';
import RightChartSidebar from "@/components/layout/Sidebar/RightChartSidebar";

interface element_type {
  type: number;
  value: string;
  path: {
    table_name: string;
    filepath: string;
    filesize: string;
  };
}

type Data = {
  schema: element_type[],
  title: string,
  subTitle: string,
  xAxisTitle: string,
  yAxisTitle: string,
  xAxisArray: string[],
  SourceArray: string[],
  source: number,
  barValue: number,
  xAxisValue: number,
  sort_Type: number,
  limit_Type: number
}
const DrawChart = (props: {
  type: any;
  index: number;
  db: any;
  chart_type: number;
}) => {
  const { db } = useDuckDb();
  const dispatch = useAppDispatch();
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);

  const [isShowComponent, setIsShowComponent] = useState(false);
  const [isChartData, setIsChartData] = useState({});
  const [isChartTitles, setIsChartTitles] = useState();

  const [chartData, setChartData] = useState<Data>({
    schema: [{ type: 0, value: "", path: { table_name: "", filepath: "", filesize: "" } }],
    title: "",
    subTitle: "",
    xAxisTitle: "",
    yAxisTitle: "Row Count",
    xAxisArray: [],
    SourceArray: [],
    source: 0,
    barValue: Number(props.chart_type),
    xAxisValue: 1,
    sort_Type: 0,
    limit_Type: 0
  });
  const [isModalShow1, setIsModalShow1] = useState(false);

  useEffect(() => {
    if (props.type.value === "") {
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
      setChartData((chartData) => ({ ...chartData, SourceArray: source_array }));
      setChartData((chartData) => ({ ...chartData, schema: array }));
      setChartData((chartData) => ({ ...chartData, source: source_array.length - 1 }));
      InitialDataSet(array, table_index);
    } else {
      let json_data = JSON.parse(props.type.value);
      setChartData(json_data);
      InitialDataSet(json_data.schema, json_data.source);
    }
  }, []);

  useEffect(() => {
    InitialDataSet(chartData.schema, chartData.source);
  }, [chartData.yAxisTitle, chartData.source, chartData.barValue, chartData.sort_Type, chartData.limit_Type, chartData.xAxisValue]);

  const InitialDataSet = async (array: any, index: number) => {
    let conn = await props.db.connect();
    let get_query = "";
    console.log("data.schema[Tindex] is", array[index], array[index].path, chartData.xAxisValue);
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
        {}
      )
    );
    // get array of row items
    let header_titles = Object.keys(output[0]);
    let remove_duplicated_array = removeDuplicates(header_titles);

    // get column data with row item
    let body_items: any = [];
    output.map((item: any) => {
      Object.values(item).map((value: any, index: number) => {
        if (index === chartData.xAxisValue) {
          body_items.push(value);
        }
      })
    });

    let dataset = countItems(body_items);
    let string_dataset = convertStringKeyJson(dataset)
    if (chartData.limit_Type === 0) {
      SortArray(extractJson_TopNumber(string_dataset, 10));
    } else if (chartData.limit_Type === 1) {
      SortArray(extractJson_TopNumber(string_dataset, 100));
    } else if (chartData.limit_Type === 2) {
      SortArray(extractJson_TopNumber(string_dataset, 1000));
    } else if (chartData.limit_Type === 3) {
      SortArray(string_dataset);
    }
    // remove same data of array
    let chart_titles: any = {
      title: chartData.title,
      subtitle: chartData.subTitle,
      Y_Axis: chartData.yAxisTitle,
      X_Axis: remove_duplicated_array[chartData.xAxisValue]
    }
    setChartData((chartData) => ({ ...chartData, xAxisTitle: remove_duplicated_array[chartData.xAxisValue] }));
    setChartData((chartData) => ({ ...chartData, xAxisArray: remove_duplicated_array }));
    setIsChartTitles(chart_titles);
    setIsShowComponent(true);
    setComponetType();
  }

  const SortArray = (limited_dataset: any) => {
    if (chartData.sort_Type === 0) {  //sort by AZ
      setIsChartData(sortbyKey(limited_dataset));
    } else if (chartData.sort_Type === 1) {
      let temp = sortbyKey(limited_dataset);
      setIsChartData(reverseArray(temp));
    } else if (chartData.sort_Type === 2) {
      setIsChartData(sortbyValue(limited_dataset));
    } else if (chartData.sort_Type === 3) {
      let temp = sortbyValue(limited_dataset);
      setIsChartData(reverseArray(temp));
    }
  }

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

  const setComponetType = async () => {
    let data = {
      HASH: duckbook["HASH"],
    };
    let select_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/getdbbyhash";
    await axios
      .post(select_apiUrl, data)
      .then((response) => {
        let temp_data: any = response.data;
        let array = JSON.parse(temp_data[0][4]);
        let item = {
          type: 3,
          value: "",
          path: {
            table_name: "",
            filepath: "",
            filesize: "",
          },
        };
        item.value = JSON.stringify(chartData);
        array[props.index] = item;
        dispatch(setChangeDuckBookData(JSON.stringify(array)));
        saveDuckDBData(JSON.stringify(array));
      })
      .catch((error) => {
        console.error("Error20:", error.message);
      });
  };

  return (
    <div>
      {isShowComponent &&
        (<div className="relative" onClick={() => {
          setIsModalShow1(true);
        }}>
          <div className={"border border-indigo-500 px-5 py-3 rounded-lg mb-5 relative"}>
            <div className="w-full h-full">
              <span className='flex flex-1 w-full justify-start text-base text-black font-bold'>{chartData.title}</span>
              <span className='flex flex-1 w-full justify-start text-sm text-gray-500'>{chartData.subTitle}</span>
              <ChartComponent data={isChartData} titles={isChartTitles} chart_type={chartData.barValue} />
              <span className='flex flex-1 w-full justify-center text-xs text-gray-700'>{chartData.xAxisTitle}</span>
            </div>
          </div>
        </div>)}
      <div>
        {isModalShow1 && (
          <RightChartSidebar data={chartData} setData={setChartData} />
        )}
      </div>
    </div>
  );
}
export default DrawChart;