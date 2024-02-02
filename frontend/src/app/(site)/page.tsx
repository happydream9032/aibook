"use client";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDuckBookListState } from "@/redux/features/navbarlist-slice";
import { setDuckBookState } from "@/redux/features/navbar-slice";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const myArray = JSON.parse(localStorage.getItem("my-array"));
    if (myArray == null) {
      localStorage.setItem("my-array", JSON.stringify([]));
    }
    getTableData();
  }, []);

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
    let select_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/getdbtable";
    await axios
      .post(select_apiUrl)
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
    const date = new Date().toJSON();
    let path = { table_name: "", filepath: "" };
    let componet = { type: 0, value: "", path: path };

    let temp = [];
    temp.push(componet);
    let data = {
      USER_ID: "23443464",
      TABLE_NAME: "NoTitle",
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
