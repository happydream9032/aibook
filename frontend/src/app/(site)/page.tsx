"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUserState } from "@/redux/features/user-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDuckBookListState } from "@/redux/features/navbarlist-slice";
import { setDuckBookState } from "@/redux/features/navbar-slice";
import { DuckDBConfig } from "@duckdb/duckdb-wasm";
import { initializeDuckDb } from "duckdb-wasm-kit";
import { useDuckDb } from "duckdb-wasm-kit";
import { AsyncDuckDB } from "duckdb-wasm-kit";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState();
  const { db } = useDuckDb() as { db: AsyncDuckDB };

  useEffect(() => {
    const config: DuckDBConfig = { query: { castBigIntToDouble: true, }, }
    initializeDuckDb({ config, debug: true });
    let temp: any = localStorage.getItem("user_data")
    let user_data = JSON.parse(temp);
    if (user_data == null || Object.entries(user_data).length === 0) {
      router.push("/sign-in");
    } else {
      verify_Email(user_data)
    }
  }, []);

  const verify_Email = async (user_data: any) => {
    try {
      let data = {
        EMAIL: user_data.email,
        TOKEN: user_data.token
      }
      let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/verify";
      await axios
        .post(update_apiUrl, data)
        .then((response) => {
          console.log("update response is", response.data);
          if (response.data.code === 200) {
            setUserData(user_data);
            dispatch(setUserState(user_data));
            getTableData();
          } else {
            localStorage.removeItem("user_data");
            router.push("/sign-in");
          }
        })
        .catch((error) => {
          console.error("Error19:", error.message);
        });
    } catch (err: any) {
      console.error(err);
    }
  }
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
    dispatch(setDuckBookState(final_data[0]));
    dispatch(setDuckBookListState(final_data));
    router.push(`/edit/${final_data[0]["HASH"]}`);
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
        if (response.data.length == 0) {
          insertTableRecorder();
        } else {
          changeTableData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error1:", error.message);
        // Handle the error
      });
  };

  const insertTableRecorder = async () => {
    let temp1: any = localStorage.getItem("user_data")
    let user_data = JSON.parse(temp1);
    const date = new Date().toJSON();
    let path = { tablename: "", filepath: "" };
    let componet = { type: 0, value: "", path: path };

    let temp = [];
    temp.push(componet);
    let data = {
      USER_ID: user_data.id,
      TABLENAME: "NoTitle",
      STATUS: 0,
      DATA: JSON.stringify(temp),
      CREATED_AT: date,
    };
    let delete_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/insertdbtable";
    await axios
      .post(delete_apiUrl, data)
      .then((response) => {
        console.log("response0 is", response.data);
        if (response.data != "") {
          getTableData();
        }
      })
      .catch((error) => {
        console.error("Error2:", error.message);
        // Handle the error
      });
  };

  return <main></main>;
}
