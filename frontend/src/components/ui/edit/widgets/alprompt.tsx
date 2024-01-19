import axios from "axios";
import { useEffect, useState } from "react";
import TypingComponent from "./input";
import Papa from 'papaparse';
import { useDuckDb } from "duckdb-wasm-kit";
import { setgpt3_5, setgpt4, reset } from "@/redux/features/todo-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useDuckDbQuery } from "duckdb-wasm-kit";

const AIPrompt = (props : any) => {
  const { db , loading, error } = useDuckDb();
  const type = useAppSelector((state) => state.todoReducer.type);

  const [isSQLDropMenu, setIsSQLDropMenu] = useState(false);
  const [isSQLQuery, setIsSQLQuery] = useState("");
  const [promptvalue, setPromptValue] = useState("");
  const [ispromptfinish, setIsPromptFinish] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFailuer, setIsFailure] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // statue get query
  const [isRunLoading, setIsRunLoading] = useState(false); // status get result of run query
  const [isResultData, setResultData] = useState([]);
  const [tabletitle, setTableTitle] = useState<String[]>([]);
  const [isfilename, setIsFileName] = useState("aiprompt");

  function handleKeyDown(event: any) {
    if (event.key === "Enter") {
      // Perform your desired action here
      setIsPromptFinish(true);
      handleRunPrompt();
    }
  }
  const handleCopy = () => {
    // Copy the text to the clipboard
    navigator.clipboard
      .writeText(promptvalue)
      .then(() => {
        // Text successfully copied
        setCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        // Unable to copy the text
        console.error("Failed to copy: ", err);
      });
  };

  const handleRunPrompt = async () => {
    try {
      let conn = await db.connect();
      if(promptvalue != ""){        
        let schema_tables = await conn.query("SELECT table_name FROM information_schema.tables;");
        let colume_length_array = schema_tables._offsets;
        let column_length = colume_length_array[colume_length_array.length-1];
        let column_array : any = [];

        let schema = [];
        for(let i =0; i < Number(column_length); i++){
          let temp_schema : any = {
            table_name : "",
            row : {},
            data : {}
          }

          let temp = schema_tables.get(i).toArray(); // table name
          let sub_table = await conn.query(`SELECT * FROM '${String(temp)}' LIMIT 1;`);

          let sub_table_schema = sub_table.schema.fields;
          let data_array = sub_table.get(0).toArray();

          let temp_schema_row : any = {};
          let temp_schema_data : any = {};
          temp_schema["table_name"] = String(temp);
          for(let i=0; i<sub_table_schema.length; i++){
            temp_schema_row[sub_table_schema[i]["name"]] = String(sub_table_schema[i]["type"]);
            temp_schema_data[sub_table_schema[i]["name"]] = data_array[i]
            //temp_array.push(String(sub_table_schema[i]["name"]+"("+sub_table_schema[i]["type"]+")")) //column data
          }
          temp_schema["row"] = temp_schema_row;
          temp_schema["data"] = temp_schema_data;
          schema.push(JSON.stringify(temp_schema));
        }  
        const data = {
          schema : schema.toString(),
          prompt: promptvalue,
          model : type,
        };
        console.log("request data is", data);
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/runprompt"; 
        await axios
          .post(apiUrl, data)
          .then((response) => {
            console.log("response is", response);
            setIsSQLQuery(response.data);
            handleRunQuery(response.data, true);
            setIsLoading(true);
          })
          .catch((error) => {
            console.error("Error:", error.message);
            // Handle the error
          });
      }
      conn.close();
    } catch (error) {
      console.error("Error:", error);
      setIsRunLoading(true);
      setIsFailure(true);
    }
  };

  const handleRunQuery = async (query:string, type:boolean) => {
    try {
      let data = ""
      if(type == true){
        data = query;
      } else {
        data = isSQLQuery;
      }
      let conn = await db.connect();
      if(data != ""){
        let check_table = await conn.query(data);
        let row_schemas = check_table.schema.fields;
        let row_array :Array<String> = [];
        row_schemas.map((row : any)=>{
          row_array.push(row["name"]);
        })

        let colume_length_array = check_table._offsets;
        let column_length = colume_length_array[colume_length_array.length-1];
        let column_array : any = []
        for(let i =0; i < Number(column_length); i++){
          let temp = check_table.get(i).toArray();
          column_array.push(temp);
        }
        console.log("Result is", column_array);
        setTableTitle(row_array);
        setResultData(column_array);
        setIsRunLoading(true);
      }
      conn.close();
    } catch (error) {
      console.error("Error:", error);
      setIsRunLoading(true);
      setIsFailure(true);
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
    <>
      {ispromptfinish ? (
        <div className="mb-5">
          <div className="w-full px-4 py-2 gap-2 text-indigo-400 font-medium text-lg border rounded-lg ring-1 border-indigo-400 flex items-center justify-between">
            <div className="items-center gap-3 lg:flex flex-1">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1"
                height="20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"></path>
              </svg>
              <input
                className="text-sm text-indigo-500 font-semibold w-full border border-transparent focus:outline-none"
                type="text"
                value={promptvalue}
                onChange={(e) => {
                  e.preventDefault();
                  setPromptValue(e.target.value);
                  if (e.target.value == "/") {
                    props.onData(0);
                  } else {
                    props.onData(4);
                  }
                }}
                onKeyDown={handleKeyDown}
              />
              {/* <span>{promptvalue}</span> */}
            </div>
            <div>
              <button
                className="text-gray-500 bg-white hover:bg-gray-200 focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center"
                type="button"
                title={""}
                onClick={handleCopy}
              >
                {copied ? (
                  <div className=" text-green-600">
                    <svg
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 8 8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      height="0.8em"
                      width="0.8em"
                      className="fill-current"
                    >
                      <path d="M2.90567 6.00024C2.68031 6.00024 2.48715 5.92812 2.294 5.74764L0.169254 3.43784C-0.0560926 3.18523 -0.0560926 2.78827 0.169254 2.53566C0.39461 2.28298 0.74873 2.28298 0.974086 2.53566L2.90567 4.66497L7.02642 0.189715C7.25175 -0.062913 7.60585 -0.062913 7.83118 0.189715C8.0566 0.442354 8.0566 0.839355 7.83118 1.09198L3.54957 5.78375C3.32415 5.92812 3.09882 6.00024 2.90567 6.00024Z" />
                    </svg>
                  </div>
                ) : (
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1.1em"
                    width="1.1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                    <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {isLoading && (
            <div>{isFailuer?(
              <div role="alert" className="relative w-full p-4 pl-11 translate-y-[-3px] border-destructive/50 text-destructive dark:border-destructive text-destructive border-2 bg-red-50 rounded-md rounded-t-none">
                <h5 className="mb-1 font-medium leading-none tracking-tight">Oops!</h5>
                <div className="text-sm [&amp;_p]:leading-relaxed whitespace-pre-wrap">Something went wrong calling the OpenAI API</div>
              </div>
            ):(
            <div className="ma-[3px] flex flex-col rounded-lg border border-indigo-700 shadow">
              <div className="w-full relative pr-20 py-3 pl-4 bg-black min-h-[110px]">
              <textarea
                id="comment"
                rows={4}
                value={isSQLQuery}
                className="w-full h-full resize-none text-sm rounded-md text-white bg-black border border-gray-500 hover:border-indigo-400 focus:ring-0"
                placeholder=" Paste data here"
                required
                onChange={(e) => {
                  e.preventDefault();
                  setIsSQLQuery(e.currentTarget.value);
                }}
              ></textarea>
              <div className="absolute bottom-4 right-4">
                <button
                  className="bg-gray-200 rounded-md px-2 py-2"
                  type="button"
                  title={""}
                  onClick={()=>{handleRunQuery("", false)}}
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
            {isRunLoading && (
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
          </div>)}</div>
            
          )}
        </div>
      ) : (
        <input
          className="text-lg text-indigo-500 font-semibold w-full border border-transparent focus:outline-none"
          type="text"
          value={promptvalue}
          placeholder="Ask AI to write SQL for you"
          onChange={(e) => {
            setPromptValue(e.target.value);
            if (e.target.value == "/") {
              props.onData(0);
            } else {
              props.onData(4);
            }
          }}
          onKeyDown={handleKeyDown}
        />
      )}
      <TypingComponent />
    </>
  );
};

export default AIPrompt;
