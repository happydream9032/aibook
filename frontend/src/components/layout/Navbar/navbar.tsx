import { useState, useEffect } from "react";
// next components
import Image from "next/image";
import axios from "axios";
import { exportCsv } from "duckdb-wasm-kit";
// custom components
import fs from "fs";
import Drawer from "./Drawer";
import DrawerData from "./DrawerData";
import { useRouter } from "next/navigation";
// third party components
import { useDuckDb } from "duckdb-wasm-kit";
import { setgpt3_5, setgpt4 } from "@/redux/features/todo-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { exportParquet } from "duckdb-wasm-kit";
import { insertFile } from "duckdb-wasm-kit";
// images and icons
import HamburgerIcon from "@/assets/images/icons/Hamburger.svg";
import GPT35Icon from "@/assets/images/icons/GPT35.svg";
import GPT4Icon from "@/assets/images/icons/GPT4.svg";
import DropMenuIcon from "@/assets/images/icons/DropMenu.svg";
import LockIcon from "@/assets/images/icons/LockIcon.svg";
import MoreViewIcon from "@/assets/images/icons/MoreView.svg";
import { data } from "jquery";

const Navbar1 = (props: { id: string }) => {
  const router = useRouter();
  const { db, loading, error } = useDuckDb();
  const type = useAppSelector((state) => state.todoReducer.type);
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);
  const dispatch = useAppDispatch();

  const [hashData, setHashData] = useState(props.id);
  const [isOpenGPTType, setIsOpenGPTType] = useState(false);
  const [isGPTType, setIsGPTType] = useState(false);
  const [isOpenPrivate, setIsOpenPrivate] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);
  const [isImportedHash, setIsImportedHash] = useState("");
  const [isExportFileData, setExportFileData] = useState([]);
  const isEnableOverlay: boolean = false;

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  const toggleTypeDropdown = () => {
    setIsOpenGPTType(!isOpenGPTType);
    setIsOpenPrivate(false);
    setIsOpenSetting(false);
  };
  const togglePrivateDropdown = () => {
    setIsOpenGPTType(false);
    setIsOpenPrivate(!isOpenPrivate);
    setIsOpenSetting(false);
  };
  const toggleSettingDropdown = () => {
    setIsOpenGPTType(false);
    setIsOpenPrivate(false);
    setIsOpenSetting(!isOpenSetting);
  };

  const toggleSidebar = () => {
    setIsSideBarOpen(!isSidebarOpen);
  };

  const savingFile = async (blob: any, suggestedName: string) => {
    // Feature detection. The API needs to be supported
    const supportsFileSystemAccess =
      "showSaveFilePicker" in window &&
      (() => {
        try {
          return window.self === window.top;
        } catch {
          return false;
        }
      })();
    // If the File System Access API is supported…
    if (supportsFileSystemAccess) {
      try {
        // Show the file save dialog.
        const handle = await showSaveFilePicker({
          suggestedName,
        });
        // Write the blob to the file.
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err: any) {
        // Fail silently if the user has simply canceled the dialog.
        if (err.name !== "AbortError") {
          console.error("error7", err.name, err.message);
          return;
        }
      }
    }
  };

  const saveFile = async () => {
    let result_json = {
      table_title: "",
      user_id: "",
      hash: "",
      design: "",
      files: "",
    };
    try {
      let database = JSON.parse(duckbook["DATA"]);
      let file_contents_array: Array<Object> = [];
      await database.map(async (item: any, index: number) => {
        let temp_path = item["path"];
        if (temp_path["table_name"] != "") {
          let filename = temp_path["table_name"];
          let file = await exportParquet(db, filename, filename, "zstd");
          let temp_file: any = { title: "", content: "" };
          let binary = "";
          let arrayBuffer = await file.arrayBuffer();
          let bytes = new Uint8Array(arrayBuffer);

          let len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          let result = window.btoa(binary);

          temp_file["title"] = filename;
          temp_file["content"] = String(result);
          file_contents_array.push(temp_file);

          if (index === database.length - 1) {
            result_json["table_title"] = duckbook["DB_NAME"];
            result_json["user_id"] = duckbook["USER_ID"];
            result_json["hash"] = duckbook["HASH"];
            result_json["design"] = database;
            result_json["files"] = JSON.stringify(file_contents_array);
            let blob = new Blob([JSON.stringify(result_json)], {
              type: "application/json",
            });
            await savingFile(blob, "example.json");
          }
        }
      });
    } catch (error) {
      console.error("File download failed", error);
    }
  };

  const ImportDatabookFile = async (e: any) => {
    let databookfile = e.target.files[0];
    if (databookfile != null) {
      const reader = new FileReader();

      reader.onload = async function (e: any) {
        const fileContent = e.target.result;
        const jsonData = JSON.parse(fileContent);
        const date = new Date().toJSON();
        let data = {
          USER_ID: jsonData["user_id"],
          TABLE_NAME: jsonData["table_title"],
          STATUS: 0,
          DATA: JSON.stringify(jsonData["design"]),
          CREATED_AT: date,
          HASH: jsonData["hash"],
        };
        console.log(data);
        setIsImportedHash(jsonData["hash"]);

        let delete_apiUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL + "/importdatabook";
        await axios
          .post(delete_apiUrl, data)
          .then(async (response) => {
            let file_contents = jsonData["files"];

            if (JSON.parse(file_contents).length > 0) {
              await JSON.parse(file_contents).map(
                async (item: any, index: number) => {
                  console.log("st4", item);
                  let myArray: any = JSON.parse(
                    localStorage.getItem("my-array")
                  );
                  if (myArray.length == 0) {
                    let binary = window.atob(item["content"]);
                    let len = binary.length;
                    let bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                      bytes[i] = binary.charCodeAt(i);
                    }
                    console.log("st6");
                    const blob = new Blob([bytes]);
                    const file = new File([blob], String(index) + ".parquet", {
                      type: "application/vnd.apache.parquet",
                      lastModified: Date.now(),
                    });
                    await insertFile(db, file, item["title"]);
                    localStorage.setItem("my-array", file_contents);
                  } else {
                    myArray.map(async (item1: any, index: number) => {
                      console.log("Done");
                      if (item["title"] != item1["title"]) {
                        let binary = window.atob(item["content"]);
                        let len = binary.length;
                        let bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                          bytes[i] = binary.charCodeAt(i);
                        }
                        console.log("st6");
                        const blob = new Blob([bytes]);
                        const file = new File(
                          [blob],
                          String(index) + ".parquet",
                          {
                            type: "application/vnd.apache.parquet",
                            lastModified: Date.now(),
                          }
                        );
                        await insertFile(db, file, item["title"]);
                      }
                    });
                  }
                }
              );
              router.push(`/edit/${jsonData["hash"]}`);
            }
          })
          .catch((error) => {
            console.error("Error8:", error.message);
            // Handle the error
          });
      };
      reader.readAsText(databookfile);
    }
  };

  return (
    <header
      className={`header top-0 left-0 z-40 flex w-full items-center bg-transparent ${
        sticky
          ? "!fixed !z-[9999] !bg-white !bg-opacity-100 shadow-sticky border-b-2 border-gray-300 backdrop-blur-sm !transition dark:!bg-primary dark:!bg-opacity-100"
          : "absolute !bg-white !bg-opacity-100 border-b-2 border-gray-300"
      }`}
    >
      <div className="py-2 px-5 z-40 mx-auto w-full">
        <div className="relative flex items-center justify-between">
          <div>
            <button
              type="button"
              data-state="closed"
              title={""}
              onClick={toggleSidebar}
            >
              <Image src={HamburgerIcon} alt="" width="24" height="24" />
            </button>
          </div>
          <div className="items-center gap-3 lg:flex">
            <Image
              src="/images/132.png"
              alt="logo"
              width={64}
              height={64}
              className="align-center w-auto"
            />
            <span className="text-xl text-gray-700 font-bold">
              Hello {duckbook["DB_NAME"]}!
            </span>
          </div>
          <div className="lg:flex items-center gap-4">
            <div className="py-2">
              <div className="relative inline-block">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                  onClick={toggleTypeDropdown}
                >
                  {isGPTType ? (
                    <Image src={GPT35Icon} alt="" width="24" height="24" />
                  ) : (
                    <Image src={GPT4Icon} alt="" width="24" height="24" />
                  )}

                  {isGPTType ? (
                    <span> GPT-3.5 &nbsp;</span>
                  ) : (
                    <span> GPT-4 &nbsp;</span>
                  )}
                  <Image src={DropMenuIcon} alt="" width="15" height="10" />
                </button>

                {isOpenGPTType && (
                  <div className="top-center z-40 absolute right-0 mt-2 py-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <ul
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                      className="w-[180px]"
                    >
                      <li role="menuitem">
                        <button
                          type="button"
                          className="w-full justify-center py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                          onClick={() => {
                            setIsGPTType(true);
                            setIsOpenGPTType(false);
                            dispatch(setgpt3_5());
                            console.log(type);
                          }}
                        >
                          <div className="grid grid-cols-6">
                            <div className="col-start-1 col-end-1">
                              <Image
                                src={GPT35Icon}
                                alt=""
                                width="24"
                                height="24"
                              />
                              &nbsp;
                            </div>
                            <div className="col-end-7 col-span-5">
                              <span className="text-base text-gray-700">
                                GPT-3.5
                              </span>
                            </div>
                            <div className="col-start-1 col-end-7">
                              <span className="text-sm text-gray-400 pb-2 px-1">
                                better for speed
                              </span>
                            </div>
                          </div>
                        </button>
                      </li>
                      <li role="menuitem">
                        <button
                          type="button"
                          className="w-full justify-center py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                          onClick={() => {
                            setIsGPTType(false);
                            setIsOpenGPTType(false);
                            dispatch(setgpt4());
                            console.log(type);
                          }}
                        >
                          <div className="grid grid-cols-6">
                            <div className="col-start-1 col-end-1">
                              <Image
                                src={GPT4Icon}
                                alt=""
                                width="24"
                                height="24"
                              />
                              &nbsp;
                            </div>
                            <div className="col-end-7 col-span-5">
                              <span className="text-base text-gray-700">
                                GPT-4
                              </span>
                            </div>
                            <div className="col-start-1 col-end-7">
                              <span className="text-sm text-gray-400 pb-2 px-1">
                                better for accuracy
                              </span>
                            </div>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div>
              <button
                type="button"
                className="px-2 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                onClick={togglePrivateDropdown}
                title={""}
              >
                <Image src={LockIcon} alt="" width="24" height="24" />
              </button>

              {isOpenPrivate && (
                <div className="top-center z-40 absolute right-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="w-[200px] px-4 py-4">
                    <span className="text-base">
                      This doc is <strong>Private</strong>.
                      <br />
                      <br />
                      Data is stored locally on your device, not sent to a
                      server.
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="py-2">
              <div className="relative inline-block">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                  onClick={toggleSettingDropdown}
                  title={""}
                >
                  <Image src={MoreViewIcon} alt="" width="24" height="24" />
                </button>

                {isOpenSetting && (
                  <div className="top-center z-40 absolute right-0 mt-2 py-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <ul
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                      className="w-[180px]"
                    >
                      <li role="menuitem">
                        <button
                          type="button"
                          className="w-full justify-center py-3 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                          onClick={() => {
                            saveFile();
                          }}
                        >
                          <span className="text-sm text-black">
                            Export DataBook file
                          </span>
                        </button>
                      </li>
                      <li role="menuitem">
                        <div className="flex flex-col justify-center">
                          <input
                            type="file"
                            name="file"
                            id="file"
                            className="sr-only"
                            onChange={(e) => {
                              e.preventDefault();
                              ImportDatabookFile(e);
                            }}
                          />
                          <label
                            htmlFor="file"
                            className="relative gap-2 flex flex-col py-3 items-center justify-center rounded-md text-center cursor-pointer hover:bg-gray-200"
                          >
                            <span className="flex-col text-sm font-medium text-black">
                              Import Databook file
                            </span>
                          </label>
                        </div>
                      </li>
                      <li role="menuitem">
                        <button
                          type="button"
                          className="w-full justify-center py-3 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                        >
                          <span className="text-sm text-red-600">
                            Delete Doc
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Drawer id={hashData} isOpen={isSidebarOpen} setIsOpen={toggleSidebar}>
          <DrawerData id={hashData} />
        </Drawer>
      </div>
    </header>
  );
};

export default Navbar1;
