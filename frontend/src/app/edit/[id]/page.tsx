"use client";
import axios from "axios";
import Navbar1 from "@/components/layout/Navbar/navbar";
import MainPage from "@/components/ui/edit/mainpage";
import { insertFile } from "duckdb-wasm-kit";
import { DuckDBConfig } from "@duckdb/duckdb-wasm";
import { initializeDuckDb } from "duckdb-wasm-kit";
import { useState, useEffect } from "react";
import { useDuckDb } from "duckdb-wasm-kit";
import { setDuckBookListState } from "@/redux/features/navbarlist-slice";
import { setDuckBookState } from "@/redux/features/navbar-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

export default function Home({ params }: { params: { id: string } }) {
  const duckbook_id: string = params.id;
  const { db, loading, error } = useDuckDb();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const duckbook = useAppSelector((state) => state.navbarReducer.data);

  useEffect(() => {
    if (db != null) {
      InitDuckDB();
    }
  }, [db]);

  const InitDuckDB = async () => {
    try {
      const myArray = JSON.parse(localStorage.getItem("my-array"));
      if (myArray == null) {
        localStorage.setItem("my-array", JSON.stringify([]));
      } else {
        await myArray.map(async (item: any, index: number) => {
          let conn = await db.connect();

          let table_count_query = await conn.query(
            `SELECT * FROM information_schema.tables WHERE TABLE_NAME LIKE '${item["title"]}';`
          );
          let table_count_array = table_count_query._offsets;
          let table_count = table_count_array[table_count_array.length - 1];
          console.log("Number(table_count)", Number(table_count));
          if (Number(table_count) == 0) {
            let binary = window.atob(item["content"]);
            let len = binary.length;
            let bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binary.charCodeAt(i);
            }

            const blob = new Blob([bytes]);
            const file = new File([blob], String(index) + ".parquet", {
              type: "application/vnd.apache.parquet",
              lastModified: Date.now(),
            });
            await insertFile(db, file, item["title"]);
          }
        });
      }
      if (Object.keys(duckbook).length === 0) {
        router.push("/");
      } else {
        getTableData();
      }
    } catch (error) {
      console.log("222", error);
    }
  };

  const setDuckBookDB = async () => {
    let data = {
      HASH: duckbook_id,
    };
    let select_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/getdbbyhash";
    await axios
      .post(select_apiUrl, data)
      .then((response) => {
        console.log("response is", response.data);

        let final_data: any = [];
        response.data.map((item: any, index: number) => {
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
    response_data.map((item: any, index: number) => {
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
    setIsLoading(true);
  };

  const getTableData = async () => {
    let select_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/getdbtable";
    await axios
      .post(select_apiUrl)
      .then((response) => {
        console.log("response is", response.data);
        changeTableData(response.data);
      })
      .catch((error) => {
        console.error("Error4:", error.message);
        // Handle the error
      });
  };

  return (
    <main>
      {isLoading && (
        <div>
          <div className="bg-white text-gray-600" >
            <Navbar1 id={duckbook_id} />
          </div>
          < MainPage id={duckbook_id} />
        </div>
      )
      }
    </main>
  );
}
