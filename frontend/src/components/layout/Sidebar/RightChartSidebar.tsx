import Image from "next/image";
import { useState, useEffect } from "react";
import FollowUpIcon from "@/assets/images/icons/FollowUpIcon.svg";
import FollowDownIcon from "@/assets/images/icons/FollowDownIcon.svg";

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

const RightChartSidebar = (props: { data: any; setData: any }) => {
  const [isShowOptionPanel, setIsShowOptionPanel] = useState(true);
  const [isShowLabelPanel, setIsShowLabelPanel] = useState(true);

  const [isChartTypeArray, setIsChartTypeArray] = useState(['bar', 'line', 'point']);
  const [isSortTypeArray, setIsSortTypeArray] = useState(['A-Z', 'Z-A', 'Large to Small', 'Small to Large']);
  const [isLimitTypeArray, setIsLimitTypeArray] = useState(['First 10', 'First 100', 'Fist 1000', 'All Values']);
  const [isShowModel, setIsShowModel] = useState(false);

  useEffect(() => {
    setIsShowModel(true);
  }, [props.data]);


  return (
    <div>{isShowModel && (<div className="fixed inset-y-0.5 right-0 w-[250px] bg-gray-600 bg-opacity-0 h-screen flex items-center justify-end">
      <div className="w-full h-full overflow-hidden rounded-lg border bg-gray-50 text-sm text-gray-700 shadow-xl">
        <div className="flex mt-16 gap-3 px-4 h-[52px] bg-white border-b-2 border-gray-300">
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
              {/* <select className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2" value={isTableName} onChange={(e) => { setIsTableName(parseInt(e.target.value, 10)); handleChangeChartDetails("source", parseInt(e.target.value, 10)); }}> */}
              <select
                className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2"
                value={props.data.source}
                onChange={(e) => { props.setData({ ...props.data, source: parseInt(e.target.value, 10) }) }}>
                {props.data.SourceArray.map((item: string, index: number) => (
                  <option key={index} value={index}><span className="p-2 text-sm text-gray-700">{item}</span></option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 py-1 px-4">
              <div className="flex py-2 flex-1 cursor-default item-center whitespace-nowrap w-1/4 font-medium">
                Type
              </div>
              <select className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2"
                value={props.data.barValue}
                onChange={(e) => { props.setData({ ...props.data, barValue: parseInt(e.target.value, 10) }) }}>
                {isChartTypeArray.map((item: string, index: number) => (
                  <option key={index} value={index}><span className="p-2 text-sm text-gray-700">{item}</span></option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 py-1 px-4">
              <div className="flex py-2 flex-1 cursor-default item-center whitespace-nowrap w-1/4 font-medium">
                X-Axis
              </div>
              <select className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2"
                value={props.data.xAxisValue}
                onChange={(e) => { props.setData({ ...props.data, xAxisValue: parseInt(e.target.value, 10) }) }}>
                {props.data.xAxisArray.map((item: string, index: number) => (
                  <option className="py-2" key={index} value={index}>
                    <span className="p-2 py-3 text-sm text-gray-700">{item}</span>
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 py-1 px-4">
              <div className="flex py-2 flex-1 cursor-default item-center whitespace-nowrap w-1/4 font-medium">
                Y-Axis
              </div>
              <select className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2"
                value={props.data.yAxisValue}
                onChange={(e) => { props.setData({ ...props.data, yAxisValue: parseInt(e.target.value, 10) }) }}>
                {props.data.yAxisArray.map((item: string, index: number) => (
                  <option className="py-2" key={index} value={index}>
                    <span className="p-2 py-3 text-sm text-gray-700">{item}</span>
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col align-stretch pt-1 pb-4 justity-start border-y-2 border-gray-300">
            <div className="flex gap-3 py-3 px-4">
              <button className="flex flex-1 w-full border-none bg-gray-50 "
                onClick={() => { setIsShowOptionPanel(!isShowOptionPanel) }}>
                <span className="flex flex-1 justify-start text-sm text-gray-600">Options</span>
                {isShowOptionPanel ?
                  (
                    <Image className="flex justify-end" src={FollowDownIcon} width={15} height={15} alt="down" />
                  ) : (
                    <Image className="flex justify-end" src={FollowUpIcon} width={15} height={15} alt="down" />
                  )}
              </button>
            </div>
            {isShowOptionPanel && (<div><div className="flex gap-3 py-1 px-4">
              <div className="flex py-2 flex-1 cursor-default item-center whitespace-nowrap w-1/4 font-medium">
                Sort
              </div>
              <select
                className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2"
                value={props.data.sort_Type}
                onChange={(e) => { props.setData({ ...props.data, sort_Type: parseInt(e.target.value, 10) }) }}>
                {isSortTypeArray.map((item: string, index: number) => (
                  <option key={index} value={index}><span className="p-2 text-sm text-gray-700">{item}</span></option>
                ))}
              </select>
            </div>
              <div className="flex gap-3 py-1 px-4">
                <div className="flex py-2 flex-1 w-1/4 cursor-default item-center whitespace-nowrap font-medium">
                  Limit
                </div>
                <select
                  className="bg-white border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 p-2"
                  value={props.data.limit_Type}
                  onChange={(e) => { props.setData({ ...props.data, limit_Type: parseInt(e.target.value, 10) }) }}>
                  {isLimitTypeArray.map((item: string, index: number) => (
                    <option key={index} value={index}><span className="p-2 text-sm text-gray-700">{item}</span></option>
                  ))}
                </select>
              </div>
            </div>)}
          </div>
          <div className="flex flex-col align-stretch pt-1 pb-4 justity-start border-y-2 border-gray-300">
            <div className="flex gap-3 py-3 px-4">
              <button className="flex flex-1 w-full border-none bg-gray-50 "
                onClick={() => { setIsShowLabelPanel(!isShowLabelPanel) }}>
                <span className="flex flex-1 justify-start text-sm text-gray-600">Labels</span>
                {isShowLabelPanel ?
                  (
                    <Image className="flex justify-end" src={FollowDownIcon} width={15} height={15} alt="down" />
                  ) : (
                    <Image className="flex justify-end" src={FollowUpIcon} width={15} height={15} alt="down" />
                  )}
              </button>
            </div>
            {isShowLabelPanel && (<div><div className="flex gap-3 py-1 px-4">
              <div className="flex py-2 flex-1 cursor-default w-1/4 item-center whitespace-nowrap font-medium">
                Title
              </div>
              <input
                className="shadow-sm border border-gray-200 rounded-md block font-sm px-2 py-2 w-3/4 focus:border-indigo-500"
                type="text"
                value={props.data.title}
                onChange={(e) => { props.setData({ ...props.data, title: e.currentTarget.value }) }}
              />
            </div>
              <div className="flex gap-3 py-1 px-4">
                <div className="flex py-2 flex-1 cursor-default item-center w-1/4 whitespace-nowrap font-medium">
                  SubTitle
                </div>
                <input
                  className="shadow-sm border border-gray-200 rounded-md block font-sm px-2 py-2 w-3/4 focus:border-indigo-500"
                  type="text"
                  value={props.data.subTitle}
                  onChange={(e) => { props.setData({ ...props.data, subTitle: e.currentTarget.value }) }}
                />
              </div>
              <div className="flex gap-3 py-1 px-4">
                <div className="flex py-2 flex-1 cursor-default w-1/4 item-center whitespace-nowrap font-medium">
                  X-Axis
                </div>
                <input
                  className="shadow-sm border border-gray-200 rounded-md block font-sm px-2 py-2 w-3/4 focus:border-indigo-500"
                  type="text"
                  value={props.data.xAxisTitle}
                  onChange={(e) => { props.setData({ ...props.data, xAxisTitle: e.currentTarget.value }) }}
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
                  value={props.data.yAxisTitle}
                  onChange={(e) => { props.setData({ ...props.data, yAxisTitle: e.currentTarget.value }) }}
                />
              </div>
            </div>)}
          </div>
        </div>
      </div>
    </div>)}
    </div>
  );
};
export default RightChartSidebar;
