"use client";
import axios from "axios";
import { Suspense } from 'react'
import Navbar1 from "@/components/layout/Navbar/navbar";
import MainPage from "@/components/ui/edit/MainPage";
import { insertFile } from "duckdb-wasm-kit";
import { useState, useEffect } from "react";
import { useDuckDb } from "duckdb-wasm-kit";
import { AsyncDuckDB } from "duckdb-wasm-kit";
import { setDuckBookListState } from "@/redux/features/navbarlist-slice";
import { setDuckBookState } from "@/redux/features/navbar-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { DuckDBConfig } from "@duckdb/duckdb-wasm";
import { initializeDuckDb } from "duckdb-wasm-kit";

export default function Edit({ params }: { params: { id: string } }) {
  const duckbook_id: string = params.id;
  //const { db } = useDuckDb();
  const { db } = useDuckDb() as { db: AsyncDuckDB };
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let temp: any = localStorage.getItem("user_data");
    let user_data = JSON.parse(temp);
    console.log("user_data is", user_data);
    if (user_data === null) {
      router.push("/");
    } else {
      if (db != null) {
        getTableData();
      }

    }
  }, [db]);

  const setDuckBookDB = async () => {
    let data = {
      HASH: duckbook_id,
    };
    let select_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/getdbbyhash";
    await axios
      .post(select_apiUrl, data)
      .then((response) => {
        console.log("response1 is", response.data);

        let final_data: any = [];
        response.data.map((item: any) => {
          let temp_data = {
            ID: 0,
            USER_ID: "",
            DB_NAME: "",
            STATUE: 0,
            DATA: "",
            TIME: "",
            HASH: "",
          };
          temp_data["ID"] = item[0];
          temp_data["USER_ID"] = String(item[1]);
          temp_data["DB_NAME"] = String(item[2]);
          temp_data["STATUE"] = item[3];
          temp_data["DATA"] = String(item[4]);
          temp_data["TIME"] = String(item[5]);
          temp_data["HASH"] = String(item[6]);
          final_data.push(temp_data);
        });
        let temp: any = final_data[0];
        console.log(">>>>1<<<<", final_data[0])
        if (final_data.length === 0) {
          setIsLoading(true);
        } else {
          getFileFromMinIO(temp.DATA)

        }

        console.log("store duckbook is", final_data[0])
        dispatch(setDuckBookState(final_data[0]));
      })
      .catch((error) => {
        console.error("Error3:", error.message);
        // Handle the error
      });
  };

  const changeTableData = async (response: any) => {
    let response_data = response;
    let final_data: any = [];
    response_data.map((item: any) => {
      let temp_data = {
        ID: 0,
        USER_ID: "",
        DB_NAME: "",
        STATUE: 0,
        DATA: "",
        TIME: "",
        HASH: "",
      };
      temp_data["ID"] = item[0];
      temp_data["USER_ID"] = String(item[1]);
      temp_data["DB_NAME"] = String(item[2]);
      temp_data["STATUE"] = item[3];
      temp_data["DATA"] = String(item[4]);
      temp_data["TIME"] = String(item[5]);
      temp_data["HASH"] = String(item[6]);
      final_data.push(temp_data);
    });
    await setDuckBookDB();
    await dispatch(setDuckBookListState(final_data));
  };

  const getTableData = async () => {
    let temp: any = localStorage.getItem("user_data")
    let user_data = JSON.parse(temp);
    let data = {
      ID: user_data.id
    }
    let select_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/getdbtable";
    await axios
      .post(select_apiUrl, data)
      .then((response) => {
        console.log("response is", response.data);
        if (response.data.length == 0) {
          router.push("/");
        } else {
          changeTableData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error4:", error.message);
      });
  };

  const getFileFromMinIO = async (isFileNameArray: string) => {
    try {
      let filename_array : Array<string> = [];
      let temp_data: any = JSON.parse(isFileNameArray);
      temp_data.map(async (item: any, index: number) => {
        console.log(">>>", item, item.path)
        if (item.path.tablename !== "") {
          let isFileName = item.path.tablename;
          let select_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/getdatafile";
          let response = await axios.get(select_apiUrl, {
            params: {
              FILENAME: isFileName
            },
            responseType: 'blob' // Ensure the response is treated as a Blob
          });
          console.log("=>=", response)
          let type = "";
          if (String(isFileName).includes(".csv") || String(isFileName).includes(".CSV")) {
            type = "text/csv";
          } else if (String(isFileName).includes(".parquet") || String(isFileName).includes(".PARQUET")) {
            type = "application/vnd.apache.parquet";
          } else if (String(isFileName).includes(".arrow") || String(isFileName).includes(".ARROW")) {
            type = "application/vnd.apache.arrow.file";
          }
          console.log("uploading file type is", type);
          let blob = new Blob([response.data], { type: type });
          let file = new File([blob], isFileName, {
            type: type,
            lastModified: Date.now(),
          });
          console.log(">>db<<", db)
          let conn = await db.connect();
          let table_count_query: any = await conn.query(
            `SELECT * FROM information_schema.tables WHERE TABLE_NAME LIKE '${isFileName}';`
          );
          let table_count_array = table_count_query._offsets;
          let table_count = table_count_array[table_count_array.length - 1];
          console.log(table_count_array.length, isFileName, ">>count<<", Number(table_count))
          
          if (Number(table_count) == 0) {
            if (filename_array.includes(isFileName) == false){
              filename_array.push(isFileName)
              await insertFile(db, file, isFileName);
            }
          }
          conn.close();

        }
        if (index === temp_data.length - 1) {
          setIsLoading(true);
        }
      })

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  return (
    <main>
      <Suspense fallback={<p>Loading DuckDB ... </p>}>
        {isLoading && (
          <div>
            <div className="bg-white text-gray-600" >
              <Navbar1 id={duckbook_id} />
            </div>
            < MainPage id={duckbook_id} />
          </div>
        )}
      </Suspense>
    </main>
  );
}
