
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ChartComponent from "../../chart";
import { AsyncDuckDB } from 'duckdb-wasm-kit';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useDuckDb } from "duckdb-wasm-kit";
import { setChangeDuckBookData } from "@/redux/features/navbar-slice";
import { removeDuplicates, countItems, sortbyValue, sortbyKey, reverseArray, extractJson_TopNumber, convertStringKeyJson } from '@/util/temp';
import RightChartSidebar from "@/components/layout/Sidebar/RightChartSidebar";

interface element_type {
  type: number;
  value: string;
  path: {
    tablename: string;
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
  yAxisArray: string[],
  SourceArray: string[],
  source: number,
  barValue: number,
  xAxisValue: number,
  yAxisValue: number,
  sort_Type: number,
  limit_Type: number
}
const DrawChart = (props: {
  type: any;
  index: number;
  db: any;
  chart_type: number;
}) => {
  const { db } = useDuckDb() as { db: AsyncDuckDB };
  const dispatch = useAppDispatch();
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);

  const [isShowComponent, setIsShowComponent] = useState(false);
  const [isChartData, setIsChartData] = useState({});
  const [isChartTitles, setIsChartTitles] = useState();

  const [chartData, setChartData] = useState<Data>({
    schema: [{ type: 0, value: "", path: { tablename: "", filepath: "", filesize: "" } }],
    title: "",
    subTitle: "",
    xAxisTitle: "",
    yAxisTitle: "Row Count",
    xAxisArray: [],
    yAxisArray: ["Row Count"],
    SourceArray: [],
    source: 0,
    barValue: Number(props.chart_type),
    xAxisValue: 1,
    yAxisValue: 0,
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
          if (item.path.tablename === "") {
            array.splice(index, 1);
          }
        }
      })

      array.map((item: any, index: number) => {
        source_array.push(item.path.tablename);
      })

      console.log("===", array, source_array);
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
  }, [chartData.yAxisTitle, chartData.source, chartData.barValue, chartData.sort_Type, chartData.limit_Type, chartData.yAxisValue, chartData.xAxisValue]);

  const InitialDataSet = async (array: any, index: number) => {
    let conn = await props.db.connect();
    let get_query = "";
    console.log("data.schema[Tindex] is", array[index], array[index].path, chartData.xAxisValue);
    if (array[index].type !== 2 && array[index].type !== 3 && array[index].type !== 4) {
      if (array[index].path.tablename !== "") {
        get_query = `SELECT * FROM '${array[index].path.tablename}';`;
      }
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
    type CellInfo = /*unresolved*/ any
    let output: any = [...get_table_data].map((c) =>
      Object.keys(c).reduce(
        (acc, k) => (k ? { ...acc, [k]: `${c[k]}` } : acc),
        {} as CellInfo
      )
    );
    if (output.length > 0) {
      // get array of row items
      let header_titles = Object.keys(output[0]);
      let new_header_titles = Object.keys(output[0]);
      let remove_duplicated_array = removeDuplicates(header_titles);

      // get column data with row item
      let temp_dimention_array: any = [[]];
      output.map((item: any, index1: number) => {
        if (index1 > 0) {
          let temp_one_array: any = [];
          Object.values(item).map((value: any, index: number) => {
            temp_one_array.push(value);
            if (isNaN(parseInt(value, 10))) {
              new_header_titles[index] = "";
            }
          })
          temp_dimention_array.push(temp_one_array);
        }
      });
      console.log("total array is", temp_dimention_array);
      let yAixs_array = new_header_titles.filter((str) => str !== "");
      yAixs_array.unshift("Row Count");

      //build dataset for drawing chart
      if (chartData.yAxisValue === 0) {
        let columnItems = [];
        for (let row = 0; row < temp_dimention_array.length; row++) {
          columnItems.push(temp_dimention_array[row][chartData.xAxisValue]);
        }
        let dataset = countItems(columnItems);
        let string_dataset = convertStringKeyJson(dataset);
        LimitArray(string_dataset);
      } else {
        let columnXItems: any = [];
        let columnYItems: any = [];
        let string_dataset: any = {};
        for (let row = 0; row < temp_dimention_array.length; row++) {
          columnXItems.push(temp_dimention_array[row][chartData.xAxisValue]);
        }

        let y_title = yAixs_array[chartData.yAxisValue];
        let index = new_header_titles.indexOf(y_title);

        for (let row = 0; row < temp_dimention_array.length; row++) {
          columnYItems.push(parseFloat(temp_dimention_array[row][index]));
        }

        for (let row = 0; row < columnXItems.length; row++) {
          string_dataset[String(columnXItems[row])] = columnYItems[row];
        }
        LimitArray(string_dataset);
      }

      // remove same data of array
      let chart_titles: any = {
        title: chartData.title,
        subtitle: chartData.subTitle,
        Y_Axis: chartData.yAxisTitle,
        X_Axis: remove_duplicated_array[chartData.xAxisValue]
      }

      setChartData((chartData) => ({ ...chartData, yAxisTitle: yAixs_array[chartData.yAxisValue] }));
      setChartData((chartData) => ({ ...chartData, yAxisArray: yAixs_array }));
      setChartData((chartData) => ({ ...chartData, xAxisTitle: remove_duplicated_array[chartData.xAxisValue] }));
      setChartData((chartData) => ({ ...chartData, xAxisArray: remove_duplicated_array }));
      setIsChartTitles(chart_titles);
      setIsShowComponent(true);
      setComponetType();
    }
  }

  const LimitArray = (string_dataset: any) => {
    if (chartData.limit_Type === 0) {
      SortArray(extractJson_TopNumber(string_dataset, 10));
    } else if (chartData.limit_Type === 1) {
      SortArray(extractJson_TopNumber(string_dataset, 100));
    } else if (chartData.limit_Type === 2) {
      SortArray(extractJson_TopNumber(string_dataset, 1000));
    } else if (chartData.limit_Type === 3) {
      SortArray(string_dataset);
    }
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
            tablename: "",
            filepath: "",
            filesize: "",
          },
        };
        item.value = JSON.stringify(chartData);
        array[props.index] = item;
        //dispatch(setChangeDuckBookData(JSON.stringify(array)));
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
