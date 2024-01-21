import { useState, useEffect, useRef, useMemo } from "react";
import {Column, Table} from 'react-virtualized';
import "react-virtualized/styles.css";
const ResultTable = (data : any) => {
    //const {table_schedule, table_header, table_body} = data;
    console.log("result data is", data.data);
    const [isShowLess, setIsShowLess] = useState(false);
    
      return (
        <div className="relative">
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
                        <Table
                            width={200 * data.data.table_header.length}
                            height={390}
                            headerHeight={50}
                            rowHeight={50}
                            rowCount={data.data.table_body.length}
                            rowGetter={({ index }) =>data.data.table_body[index]}
                            >
                            {data.data.table_header.map((item : string, index : number)=>(
                                <Column
                                className="text-sm"
                                    key = {index}
                                    label={item}
                                    dataKey={item}
                                    width={200}
                                />
                            ))}
                        </Table>
                    </div>
                </div>
        </div>);
}

export default ResultTable;
