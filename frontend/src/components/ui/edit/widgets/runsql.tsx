import axios from "axios";
import { useState, useEffect } from "react";
import TypingComponent from "./input";
import Papa from 'papaparse';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RunSQL = (props : any) => {
  const [isSQLDropMenu, setIsSQLDropMenu] = useState(false);
  const [isSQLQuery, setIsSQLQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFailureStatus, setIsFailureStatus] = useState(false);
  const [isFailureValue, setIsFailureValue] = useState("")
  const [isResultData, setResultData] = useState([]);
  const [tabletitle, setTableTitle] = useState<String[]>([]);
  const [isfilename, setIsFileName] = useState("table");

  const handleRunQuery = async () => {
    try {
      const data = {
        sql_query: isSQLQuery,
      };
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/file/runquery";
      await axios
        .post(apiUrl, data)
        .then((response) => {
          console.log("response is", response);
          if (response.status == 200) {
            const reader = response.data.data;
            const titles = Object.keys(reader[0]);
            setTableTitle(titles);
            setResultData(reader);
            setIsLoading(true);
          } else if(response.status == 500) {
            toast.error("Run SQL Query is Failure", { position: "top-right" });
          }
        })
        .catch((error) => {
          toast.error("Run SQL Query is Failure", { position: "top-right" });
          console.error("Error:", error.message);
          // Handle the error
        });
    } catch (error) {
      toast.error("Run SQL Query is Failure", { position: "top-right" });
      console.error("Error:", error);
    }
  };
  const downloadCSV = () => { 
    const csvData = Papa.unparse(isResultData);
    // Creating a Blob for having a csv file format  
    // and passing the data with type 
    const blob = new Blob([csvData], { type: 'text/csv' }); 
  
    // Creating an object for downloading url 
    const url = window.URL.createObjectURL(blob) 
    console.log("URL is", url);
    // Creating an anchor(a) tag of HTML 
    const a = document.createElement('a') 
  
    // Passing the blob downloading url  
    a.setAttribute('href', url) 
  
    // Setting the anchor tag attribute for downloading 
    // and passing the download file name 
    a.setAttribute('download', isfilename+'.csv'); 
  
    // Performing a download with click 
    a.click() 
  } 

  return (
    <div className="flex flex-col">
      <ToastContainer />
      <div className="ma-[3px] my-6 flex flex-col rounded-lg border border-indigo-700 shadow">
        <div className="w-full relative pr-20 px-2 py-3 pl-4 bg-black min-h-[110px]">
          <textarea
            id="comment"
            rows={4}
            className="w-full h-full resize-none px-2 py-2 text-sm rounded-md text-white bg-black border border-gray-500 hover:border-indigo-400 focus:ring-0"
            placeholder=" Paste data here"
            required
            onChange={(e) => {
              setIsSQLQuery(e.currentTarget.value);
            }}
          ></textarea>
          <div className="absolute bottom-4 right-4">
            <button
              className="bg-gray-200 rounded-md px-2 py-2"
              type="button"
              title={""}
              onClick={handleRunQuery}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z"
                  strokeWidth="0"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        {isLoading && (
          <div className="w-full">
            <div className="my-6 w-full flex flex-col overflow-hidden right-1 shadow">
              <div className="relative pl-[10px]">
                <div className="overflow-auto">
                  <div
                    className={
                      "h-[240px] outline-none overflow-y-auto relative"
                    }
                  >
                    <div className="w-full h-full absolute">
                      <table className=" bg-white text-sm">
                        <thead>
                          <tr className="bg-blue-gray-100 text-gray-700">
                            {tabletitle.map((item, index) => (
                              <th key={index} className="py-3 px-4 text-left">
                                {item}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-blue-gray-900">
                          {isResultData.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b border-blue-gray-200"
                            >
                              {Object.values(item).map((value, index1) => (
                                <td key={index1} className="py-3 px-4">
                                  {value == null ? "" : value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex h-[45px] items-center my-">
                <div className="px-2 w-full flex items-end justify-between">
                  <span className="text-sm text-gray-300">
                    {isResultData.length} rows × {tabletitle.length} columns
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="w-full gap-2 pl-4 py-2 pr-2 flex min-h-[30px] items-center justify-between">
          <input className="text-sm text-gray-500 border border-transparent focus:outline-none" value = {isfilename} onChange={(e)=>{setIsFileName(e.currentTarget.value)}}></input>
          <div className="relative inline-block">
            <button
              type="button"
              className="px-2 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
              onClick={() => {
                setIsSQLDropMenu(!isSQLDropMenu);
              }}
              title={""}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
              </svg>
            </button>

            {isSQLDropMenu && (
              <div className="top-center z-[20] absolute right-0 my-2 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
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
                  <li role="menuitem">
                    <button
                      type="button"
                      className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                      onClick={downloadCSV}
                    >
                      <span className="text-sm text-black">CSV</span>
                    </button>
                  </li>
                  <li role="menuitem">
                    <button
                      type="button"
                      className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                    >
                      <span className="text-sm text-black">Parquet</span>
                    </button>
                  </li>
                  <li role="menuitem">
                    <button
                      type="button"
                      className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                    >
                      <span className="text-sm text-black">Arrow</span>
                    </button>
                  </li>
                  <li role="menuitem">
                    <button
                      type="button"
                      className="w-full justify-start px-3 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                      onClick={()=>{props.onData(0);}}
                    >
                      <span className="text-sm text-red-600">Delete Doc</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <TypingComponent />
    </div>
  );
};

export default RunSQL;
