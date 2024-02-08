import Image from "next/image";
import { useState, useEffect } from "react";
import FollowUpIcon from "@/assets/images/icons/FollowUpIcon.svg";
import FollowDownIcon from "@/assets/images/icons/FollowDownIcon.svg";

const RightChartSidebar = (props: { chart_data: any }) => {
  const [isShowOptionPanel, setIsShowOptionPanel] = useState(true);
  const [isShowLabelPanel, setIsShowLabelPanel] = useState(true);
  const [isTableTitle, setIsTableTitle] = useState("");
  const [isTableSubTitle, setIsTableSubTitle] = useState("");
  const [isXAxisLabel, setIsXAxisLabel] = useState("");
  const [isYAxisLabel, setIsYAxisLabel] = useState("");
  const [isX_AxisItem, setIsX_AxisItem] = useState(0);
  const [isX_AxisItemArray, setIsX_AxisItemArray] = useState([]);
  const [isTableName, setIsTableName] = useState(0);
  const [isTableNameArray, setIsTableNameArray] = useState([]);
  const [isChartType, setIsChartType] = useState(0);
  const [isChartTypeArray, setIsChartTypeArray] = useState(['bar', 'line', 'point']);
  const [isSortTypeArray, setIsSortTypeArray] = useState(['A-Z', 'Z-A', 'Large to Small', 'Small to Large']);
  const [isLimitTypeArray, setIsLimitTypeArray] = useState(['First 10', 'First 100', 'Fist 1000', 'All Values']);
  const [isSortType, setIsSortType] = useState(0);
  const [isLimit, setIsLimit] = useState(3);
  const [isShowModel, setIsShowModel] = useState(false);

  useEffect(() => {
    console.log("initial data of right sidebar is", props.chart_data);
    setIsTableTitle(props.chart_data.title);
    setIsTableSubTitle(props.chart_data.subTitle);
    setIsXAxisLabel(props.chart_data.xAxisTitle);
    setIsYAxisLabel(props.chart_data.yAxisTitle);
    setIsTableName(props.chart_data.source);
    setIsChartType(props.chart_data.isChartType);
    setIsX_AxisItem(props.chart_data.xAxisValue);
    setIsSortType(props.chart_data.sort_Type);
    setIsLimit(props.chart_data.limit_Type)
    setIsX_AxisItemArray(props.chart_data.xAxisArray);
    setIsTableNameArray(props.chart_data.SourceArray);
    setIsShowModel(true);
  }, [props.chart_data]);

  return (
    <div>{isShowModel && (<div className="top-[100px] right-1 flex w-1/6 h-[600px] items-start rounded-lg bg-transparent !fixed !z-[10] !bg-white !bg-opacity-100 shadow-sticky border border-gray-500 backdrop-blur-sm !transition">
      <div className="w-full h-full overflow-hidden rounded-lg border bg-gray-50 text-sm text-gray-700 shadow-xl">
        <div className="flex gap-3 px-4 h-[52px] bg-white border-b-2 border-gray-300">
          <div className="flex flex-1 cursor-default items-center whitespace-nowrap font-bold">
            Chart
          </div>
        </div>
        <div className="h-[calc(100%-52px)] overflow-auto relative">
          <div className="flex flex-col align-stretch py-4 justity-start border-y-2 border-gray-300">
            <div className="flex gap-3 py-1 px-4">
              <div className="flex py-2 flex-1 cursor-default item-center whitespace-nowrap w-1/4 font-medium">
                Source
              </div>
              <select className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2" value={isTableName} onChange={(e) => setIsTableName(parseInt(e.target.value, 10))}>
                {isTableNameArray.map((item: string, index: number) => (
                  <option key={index} value={index}><span className="p-2 text-sm text-gray-700">{item}</span></option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 py-1 px-4">
              <div className="flex py-2 flex-1 cursor-default item-center whitespace-nowrap w-1/4 font-medium">
                Type
              </div>
              <select className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2" value={isChartType} onChange={(e) => setIsChartType(parseInt(e.target.value, 10))}>
                {isChartTypeArray.map((item: string, index: number) => (
                  <option key={index} value={index}><span className="p-2 text-sm text-gray-700">{item}</span></option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 py-1 px-4">
              <div className="flex py-2 flex-1 cursor-default item-center whitespace-nowrap w-1/4 font-medium">
                X-Axis
              </div>
              <select className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2" value={isX_AxisItem} onChange={(e) => setIsX_AxisItem(parseInt(e.target.value, 10))}>
                {isX_AxisItemArray.map((item: string, index: number) => (
                  <option className="py-2" key={index} value={index}><span className="p-2 py-3 text-sm text-gray-700">{item}</span></option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 py-1 px-4">
              <div className="flex py-2 flex-1 cursor-default item-center whitespace-nowrap w-1/4 font-medium">
                Y-Axis
              </div>
              <select className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2">
                <option selected value="row_count">Row Count</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col align-stretch pt-1 pb-4 justity-start border-y-2 border-gray-300">
            <div className="flex gap-3 py-3 px-4">
              <button className="flex flex-1 w-full border-none bg-gray-50 " onClick={() => { setIsShowOptionPanel(!isShowOptionPanel) }}>
                <span className="flex flex-1 justify-start text-sm text-gray-600">Options</span>
                {isShowOptionPanel ? (<Image className="flex justify-end" src={FollowDownIcon} width={15} height={15} alt="down" />) : (<Image className="flex justify-end" src={FollowUpIcon} width={15} height={15} alt="down" />)}
              </button>
            </div>
            {isShowOptionPanel && (<div><div className="flex gap-3 py-1 px-4">
              <div className="flex py-2 flex-1 cursor-default item-center whitespace-nowrap w-1/4 font-medium">
                Sort
              </div>
              <select className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2" value={isSortType} onChange={(e) => setIsSortType(parseInt(e.target.value, 10))}>
                {isSortTypeArray.map((item: string, index: number) => (
                  <option key={index} value={index}><span className="p-2 text-sm text-gray-700">{item}</span></option>
                ))}
              </select>
            </div>
              <div className="flex gap-3 py-1 px-4">
                <div className="flex py-2 flex-1 w-1/4 cursor-default item-center whitespace-nowrap font-medium">
                  Limit
                </div>
                <select className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2" value={isLimit} onChange={(e) => setIsLimit(parseInt(e.target.value, 10))}>
                  {isLimitTypeArray.map((item: string, index: number) => (
                    <option key={index} value={index}><span className="p-2 text-sm text-gray-700">{item}</span></option>
                  ))}
                </select>
              </div>
            </div>)}
          </div>
          <div className="flex flex-col align-stretch pt-1 pb-4 justity-start border-y-2 border-gray-300">
            <div className="flex gap-3 py-3 px-4">
              <button className="flex flex-1 w-full border-none bg-gray-50 " onClick={() => { setIsShowLabelPanel(!isShowLabelPanel) }}>
                <span className="flex flex-1 justify-start text-sm text-gray-600">Labels</span>
                {isShowLabelPanel ? (<Image className="flex justify-end" src={FollowDownIcon} width={15} height={15} alt="down" />) : (<Image className="flex justify-end" src={FollowUpIcon} width={15} height={15} alt="down" />)}
              </button>
            </div>
            {isShowLabelPanel && (<div><div className="flex gap-3 py-1 px-4">
              <div className="flex py-2 flex-1 cursor-default w-1/4 item-center whitespace-nowrap font-medium">
                Title
              </div>
              <input
                className="shadow-sm border border-gray-200 rounded-md block font-sm px-2 py-2 w-3/4 focus:border-indigo-500"
                type="text"
                value={isTableTitle}
                onChange={(e) => {
                  setIsTableTitle(e.currentTarget.value)
                }}
              />
            </div>
              <div className="flex gap-3 py-1 px-4">
                <div className="flex py-2 flex-1 cursor-default item-center w-1/4 whitespace-nowrap font-medium">
                  SubTitle
                </div>
                <input
                  className="shadow-sm border border-gray-200 rounded-md block font-sm px-2 py-2 w-3/4 focus:border-indigo-500"
                  type="text"
                  value={isTableSubTitle}
                  onChange={(e) => {
                    setIsTableSubTitle(e.currentTarget.value)
                  }}
                />
              </div>
              <div className="flex gap-3 py-1 px-4">
                <div className="flex py-2 flex-1 cursor-default w-1/4 item-center whitespace-nowrap font-medium">
                  X-Axis
                </div>
                <input
                  className="shadow-sm border border-gray-200 rounded-md block font-sm px-2 py-2 w-3/4 focus:border-indigo-500"
                  type="text"
                  value={isXAxisLabel}
                  onChange={(e) => {
                    setIsXAxisLabel(e.currentTarget.value);
                  }}
                />
              </div>
              <div className="flex gap-3 py-1 px-4">
                <div className="flex py-2 w-1/4 flex-1 cursor-default item-center whitespace-nowrap font-medium">
                  Y-Axis
                </div>
                <input
                  className="shadow-sm border border-gray-200 rounded-md block font-sm px-2 py-2 w-3/4 focus:border-indigo-500"
                  type="text"
                  placeholder="Row Count"
                  value={isYAxisLabel}
                  onChange={(e) => {
                    setIsYAxisLabel(e.currentTarget.value);
                  }}
                />
              </div>
            </div>)}
          </div>
        </div>
      </div>
    </div>)}</div>

  );
};
export default RightChartSidebar;
