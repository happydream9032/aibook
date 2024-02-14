"use client";
import React from "react";
import axios from "axios";

import TypingComponent from "./widgets/TypingComponent";
import RightSidebar from "@/components/layout/Sidebar/RightSidebar";
import RightChartSidebar from "@/components/layout/Sidebar/RightChartSidebar";

import { useRouter } from "next/navigation";
import { setChangeDuckBookName } from "@/redux/features/navbar-slice";
import { setDuckBookListState } from "@/redux/features/navbarlist-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useState, useEffect } from "react";

const MainPage = (props: { id: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);
  const [dbname, setDbName] = useState("");
  const [isChartData, setIsChartData] = useState(null);
  const [isComponetData, setIsComponetData] = useState({});
  const [isModalShow, setIsModalShow] = useState(false);

  useEffect(() => {
    setDbName(duckbook["DB_NAME"]);
  }, []);

  const chanageDBName = async (value: string) => {
    let data = {
      ID: duckbook["ID"],
      DB_NAME: value,
    };
    let change_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/changedbname";
    await axios
      .post(change_apiUrl, data)
      .then((response) => {
        console.log("response is", response.data);
        if (response.data.ID != 0) {
          getTableData();
        }
      })
      .catch((error) => {
        console.error("Error9:", error.message);
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
    await dispatch(setDuckBookListState(final_data));
    router.push(`/edit/${duckbook["HASH"]}`);
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
        console.log("response1 is", response.data);
        changeTableData(response.data);
      })
      .catch((error) => {
        console.error("Error10:", error.message);
        // Handle the error
      });
  };

  const handlechanageDBName = (text: string) => {
    let text_data = text.replace("👋 Hi ", "");
    dispatch(setChangeDuckBookName(text_data));
    chanageDBName(text_data);
  };

  const handleComponetData = async (data: any) => {
    await setIsComponetData(data);
    setIsModalShow(true);
  };
  return (
    <main className="mantine-prepend-1682jzp">
      <div className="w-full h-[100vh] bg-white pt-20">
        <div
          className="w-screenF flex gap-4 mb-[300px]"
          onClick={() => {
            setIsModalShow(false);
          }}
        >
          <div className="min-w-[308px]" />
          <div className="flex-1 text-sm text-lg text-black px-4">
            <div
              contentEditable={true}
              suppressContentEditableWarning={true}
              tabIndex={0}
              className="ProseMirror prose prose-p:text-lg mb-[50px] max-w-none focus:outline-none"
            >
              <input
                className="text-3xl font-extrabold border border-transparent focus:outline-none"
                onChange={(e) => {
                  setDbName(e.currentTarget.value);
                  handlechanageDBName(e.currentTarget.value);
                }}
                value={dbname}
              />
              <p className="py-4 text-lg">
                DataBook is an AI-powered SQL notebook that helps you explore
                and visualize datasets in your browser — powered by 🦆 DataBook
                and ✨ GPT-4.
              </p>
              <p className="py-4 text-lg">
                To get started, try <strong>typing</strong> a
                &#34;&#34;/&#34;&#34; to see what you can do.
              </p>
              <p className="py-4 text-lg">
                Tip: Try loading a dataset, then use AI to ask a question about
                it.
              </p>
              <TypingComponent
                showDropMenu={true}
                selectComponentData={(data: any) => handleComponetData(data)}
              />
            </div>
          </div>
          <div className="min-w-[302px] max-w-[352px]">
            {isModalShow && <RightSidebar table_data={isComponetData} />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainPage;
