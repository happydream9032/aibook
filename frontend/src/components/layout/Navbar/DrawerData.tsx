"use client";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { setDuckBookState } from "@/redux/features/navbar-slice";
import { setDuckBookListState } from "@/redux/features/navbarlist-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import DeleteDocumentIcon from "@/assets/images/icons/DeleteRecorder.svg";
import NewDocumentIcon from "@/assets/images/icons/NewDocument.svg";

const OpenDialog = (props: {
  selectDeleteRecoder: () => void;
  closeModal: () => void;
  tableTitle: string;
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 h-screen w-screen flex items-start justify-center z-30" >
      <div className="p-4 border w-150 shadow-lg rounded-md bg-white" >
        <div className="text-left" >
          <h3 className="text-lg font-bold text-gray-900" > Delete Document ? </h3>
          <div className="mt-2 py-3" >
            <p className="text-sm text-gray-500" >
              Are you sure you want to permanently delete "{props.tableTitle}" ?
            </p>
          </div>
          <div className="flex justify-end mt-2" >
            {/* Navigates back to the base URL - closing the modal */}
            <button
              className="px-3 py-1 mx-2 bg-white text-black border border-gray-700 text-sm font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={() => {
                props.closeModal();
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 mx-2 bg-red-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={() => {
                props.selectDeleteRecoder();
                props.closeModal();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DrawerData = ({ id }: { id: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const duckbooklist = useAppSelector((state) => state.navbarlistReducer.data);
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);

  const [isListData, setisListData] = useState([]);
  const [isDeleteRecoder, setIsDeleteRecoder] = useState(false);
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [isDeleteNumber, setIsDeleteNumber] = useState(0);
  const [isDeleteName, setIsDeleteName] = useState("");

  useEffect(() => {
    console.log("duckbook is = ", duckbook);
    setisListData(duckbooklist);
  }, [duckbooklist]);

  const changeTableData = (response: any) => {
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
    dispatch(setDuckBookState(final_data[0]));
    dispatch(setDuckBookListState(final_data));
    setisListData(final_data);
  };

  const handleSelectDeleteRecorder = () => {
    setIsDeleteRecoder(false);
    deleteTableRecorder();
  };

  const closeDialog = () => {
    setIsShowDeleteDialog(false);
  };
  const deleteTableRecorder = async () => {
    let data = {
      ID: isDeleteNumber,
    };
    let delete_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/deletedbtable";
    await axios
      .post(delete_apiUrl, data)
      .then((response) => {
        console.log("delee response is", response.data);
        if (response.data != "") {
          if (isDeleteNumber === duckbook["ID"]) {
            router.push("/");
          } else {
            window.location.reload();
          }
        }
      })
      .catch((error) => {
        console.error("Error5:", error.message);
        // Handle the error
      });
  };

  const insertTableRecorder = async () => {
    let temp1: any = localStorage.getItem("user_data");
    let temp_userdata = JSON.parse(temp1)
    const date = new Date().toJSON();
    let path = { tablename: "", filepath: "" };
    let componet = { type: 0, value: "", path: path };

    let temp = [];
    temp.push(componet);

    let data = {
      USER_ID: temp_userdata.id,
      TABLENAME: "NoTitle",
      STATUS: 0,
      DATA: JSON.stringify(temp),
      CREATED_AT: date,
    };

    let delete_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/insertdbtable";
    await axios
      .post(delete_apiUrl, data)
      .then((response) => {
        console.log("response is", response.data);
        if (response.data != "") {
          router.push(`/edit/${response.data}`);
        }
      })
      .catch((error) => {
        console.error("Error6:", error.message);
        // Handle the error
      });
  };

  return (
    <div className="rounded-md max-w-sm w-full h-full" >
      <header className=" mb-5 flex items-center justify-center" >
        <div>
          <button
            type="button"
            className="w-[200px] px-4 py-2 justify-center bg-gray-100 hover:bg-gray-100 border border-gray-600 round-lg font-medium text-sm inline-flex gap-4 items-center"
            onClick={() => {
              insertTableRecorder();
            }}
          >
            <Image src={NewDocumentIcon} alt="" width="20" height="20" />
            New Doc
          </button>
        </div>
      </header>
      <div className="flex-1 justify-between" >
        <div className="sm:block" >
          {isListData.map((item, index) => (
            <div
              className="group flex cursor-pointer border-b border-gray-200 py-2 px-4 hover:bg-gray-200 items-center justify-between"
              key={index}
            >
              <button
                className="relative gap-2 grid grid-rows-2 flex flex-1 items-center justify-start"
                onClick={() => {
                  router.push(`/edit/${item["HASH"]}`);
                }}
              >
                <span className="w-full flex flex-1 text-lg" >
                  {item["DB_NAME"]}
                </span>
                < span className="w-full flex flex-1 text-sm text-gray-400" >
                  234234
                </span>
              </button>
              <button
                className="flex align-stretch justify-start py-1"
                onClick={() => {
                  setIsDeleteName(item["DB_NAME"]);
                  setIsDeleteNumber(item["ID"]);
                  setIsShowDeleteDialog(true);
                }}
              >
                <Image src={DeleteDocumentIcon} alt="" width="24" height="24" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {
        isShowDeleteDialog && (
          <OpenDialog
            tableTitle={isDeleteName}
            closeModal={() => closeDialog()
            }
            selectDeleteRecoder={() => handleSelectDeleteRecorder()}
          />
        )}
    </div>
  );
};

export default DrawerData;
