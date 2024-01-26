"use client";
import axios from "axios";
import Navbar1 from "@/components/layout/Navbar/navbar";
import MainPage from "@/components/ui/edit/mainpage";
import { DuckDBConfig } from "@duckdb/duckdb-wasm";
import { initializeDuckDb } from "duckdb-wasm-kit";

import { useState, useEffect } from "react";
import { setDuckBookListState } from "@/redux/features/navbarlist-slice";
import { setDuckBookState } from "@/redux/features/navbar-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

export default function Home({ params }: { params: { id: string } }) {
  const duckbook_id: string = params.id;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const duckbook = useAppSelector((state) => state.navbarReducer.data);

  useEffect(() => {
    console.log("here is edit page");
    const config: DuckDBConfig = {
      query: {
        castBigIntToDouble: true,
      },
    };
    initializeDuckDb({ config, debug: true });

    if (Object.keys(duckbook).length === 0) {
      router.push("/");
    } else {
      getTableData();
    }
  }, []);

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
        console.error("Error:", error.message);
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
        console.error("Error:", error.message);
        // Handle the error
      });
  };

  return (
    <main>
      {isLoading && (
        <div>
          <div className="bg-white text-gray-600">
            <Navbar1 id={duckbook_id} />
          </div>
          <MainPage id={duckbook_id} />
        </div>
      )}
    </main>
  );
}
