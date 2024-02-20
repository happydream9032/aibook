import { useState, useEffect } from "react";
// next components
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
// custom components
import Drawer from "./Drawer";
import DrawerData from "./DrawerData";
import MainSettingsComponent from "@/components/ui/edit/widgets/settings/MainSettings";
import { useRouter } from "next/navigation";
import { useSession, signOut } from 'next-auth/react';
// third party components
import { useDuckDb } from "duckdb-wasm-kit";
import { setgpt3_5, setgpt4 } from "@/redux/features/todo-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { exportParquet } from "duckdb-wasm-kit";
import { insertFile } from "duckdb-wasm-kit";
import { AsyncDuckDB } from "duckdb-wasm-kit";
// images and icons
import HamburgerIcon from "@/assets/images/icons/Hamburger.svg";
import GPT35Icon from "@/assets/images/icons/GPT35.svg";
import GPT4Icon from "@/assets/images/icons/GPT4.svg";
import DropMenuIcon from "@/assets/images/icons/DropMenu.svg";
import LockIcon from "@/assets/images/icons/LockIcon.svg";
import MoreViewIcon from "@/assets/images/icons/MoreView.svg";
import SettingIcon from "@/assets/images/icons/SettingsIcon.svg";
import SignOutIcon from "@/assets/images/icons/SignoutIcon.svg"

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
type User_Info = {
  id: number,
  name: string,
  user_id: number,
  email: string,
  password: string,
  status: number,
  image: string,
  create_at: string,
  login_type: number,
  ip_address: string,
  ip_location: string,
  token: string
}

const Navbar1 = (props: { id: string }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { db } = useDuckDb() as { db: AsyncDuckDB };
  const type = useAppSelector((state) => state.todoReducer.type);
  const duckbook: any = useAppSelector((state) => state.navbarReducer.data);
  const userdata: any = useAppSelector((state) => state.userReducer.data);
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<User_Info>({
    id: 0,
    name: "",
    user_id: 0,
    email: "",
    password: "",
    status: 0,
    image: "",
    create_at: "",
    login_type: 0,
    ip_address: "",
    ip_location: "",
    token: ""
  });
  const [hashData, setHashData] = useState(props.id);
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [isDeleteNumber, setIsDeleteNumber] = useState(0);
  const [isDeleteName, setIsDeleteName] = useState("");
  const [isOpenGPTType, setIsOpenGPTType] = useState(false);
  const [isGPTType, setIsGPTType] = useState(false);
  const [isOpenPrivate, setIsOpenPrivate] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);
  const [isUserManagement, setIsUserManagement] = useState(false);
  const [isShowUserDialog, setIsShowUserDialog] = useState(false);
  const [isImportedHash, setIsImportedHash] = useState("");
  const [isDeleteRecoder, setIsDeleteRecoder] = useState(false);
  const [isComponentShow, setIsComponentShow] = useState(false);

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
  }, []);

  useEffect(() => {
    let temp: any = localStorage.getItem("user_data");
    setUserData(JSON.parse(temp));
    setIsComponentShow(true);
  }, [duckbook]);

  const toggleTypeDropdown = () => {
    setIsOpenGPTType(!isOpenGPTType);
    setIsOpenPrivate(false);
    setIsOpenSetting(false);
    setIsUserManagement(false);
  };
  const togglePrivateDropdown = () => {
    setIsOpenGPTType(false);
    setIsOpenPrivate(!isOpenPrivate);
    setIsOpenSetting(false);
    setIsUserManagement(false);
  };
  const toggleSettingDropdown = () => {
    setIsOpenGPTType(false);
    setIsOpenPrivate(false);
    setIsOpenSetting(!isOpenSetting);
    setIsUserManagement(false);
  };
  const toggleUserManagement = () => {
    setIsOpenGPTType(false);
    setIsOpenPrivate(false);
    setIsOpenSetting(false);
    setIsUserManagement(!isUserManagement);
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
        const handle = await (window as any).showSaveFilePicker({
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
        if (temp_path["tablename"] != "") {
          let filename = temp_path["tablename"];
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
          TABLENAME: jsonData["table_title"],
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
                  let conn = await db.connect();
                  let table_count_query: any = await conn.query(
                    `SELECT * FROM information_schema.tables WHERE TABLE_NAME LIKE '${item["title"]}';`
                  );
                  let table_count_array = table_count_query._offsets;
                  let table_count = table_count_array[table_count_array.length - 1];
                  if (Number(table_count) == 0) {
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

  const closeDialog = () => {
    setIsShowDeleteDialog(false);
  };

  const handleSelectDeleteRecorder = () => {
    setIsDeleteRecoder(false);
    deleteTableRecorder();
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

  const handleUserManagementDialog = async () => {
    setIsShowUserDialog(false);
  }

  const userLogout = () => {
    let temp: any = localStorage.getItem("user_data");
    let user_data = JSON.parse(temp);
    if (user_data["login_type"] === 1) {
      localStorage.removeItem("user_data");
      localStorage.removeItem("nextauth.message");
      signOut();
      if (!session) {
        router.push("/sign-in");
      }
    } else {
      localStorage.removeItem("user_data");
      router.push("/sign-in");
    }

  }

  const changeProfileImage = (url: string) => {
    console.log("==", url)
    setUserData((userData) => ({ ...userData, image: url }));
  }
  return (
    <div>
      {isComponentShow && (<header
        className={`header top-0 left-0 z-40 flex w-full items-center bg-transparent ${sticky
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
                    <Image src={isGPTType ? GPT35Icon : GPT4Icon} alt="" width="24" height="24" />
                    <span>{isGPTType ? "GPT-3.5 " : "GPT-4 "}</span>
                    {/* <Image src={DropMenuIcon} alt="" width="15" height="10" /> */}
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
                            onClick={() => {
                              setIsDeleteName(duckbook["DB_NAME"]);
                              setIsDeleteNumber(duckbook["ID"]);
                              setIsShowDeleteDialog(true);
                            }}
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
              <div className="">
                <button
                  type="button"
                  className="px-2 py-2 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                  onClick={toggleUserManagement}
                  title={""}
                >
                  {userData.image === "" ? (<div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-lime-950 rounded-full mt-2">
                    <span className="font-medium text-xl text-white">{userData.name.charAt(0)}</span>
                  </div>) : (<Image className="rounded-full w-10 h-10" src={process.env.NEXT_PUBLIC_API_BASE_URL + "/files/" + userData.image} width={40} height={10} alt="img" />)}
                </button>
                {isUserManagement && (
                  <div className="top-center z-10 absolute right-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 flex flex-col gap-1">
                    <div className="flex justify-start mb-2 px-6 py-2 mt-5">
                      {userData.image === "" ? (<div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-lime-950 rounded-full mt-2">
                        <span className="font-medium text-xl text-white">{userData.name.charAt(0)}</span>
                      </div>) : (<Image className="mt-2 rounded-full w-10 h-10" src={process.env.NEXT_PUBLIC_API_BASE_URL + "/files/" + userData.image} width={60} height={15} alt="img" />)}

                      <div className="flex flex-col flex-1">
                        <span className="font-bold px-5 py-1 item-center text-sm text-gray-700">{userData.name}</span>
                        <span className="font-medium px-5 py-1 item-center text-sm text-gray-400">{userData.email}</span>
                      </div>
                    </div>
                    <button className="flex py-3 px-10 justify-start bg-white hover:bg-gray-200 text-sm text-gray-400 w-full" onClick={() => { setIsShowUserDialog(true) }}><Image src={SettingIcon} alt="" width="16" height="16" className="mr-10" />Manage Account</button>
                    <button className="flex py-3 px-10 justify-start bg-white hover:bg-gray-200 text-sm text-gray-400 w-full" onClick={() => { userLogout(); }}><Image src={SignOutIcon} alt="" width="16" height="16" className="mr-10" />Sign out</button>
                    <div className="flex justify-end mt-4 mb-3">
                      <Link
                        target="_blank"
                        href="https://www.duckbook.ai/terms"
                        className="text-gray-400 hover:text-gray-500 font-bold text-xs px-2">Terms</Link>
                      <Link
                        target="_blank"
                        href="https://www.duckbook.ai/privacy"
                        className="text-gray-400 hover:text-gray-500 font-bold text-xs px-2">Privacy</Link>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
          <Drawer id={hashData} isOpen={isSidebarOpen} setIsOpen={toggleSidebar}>
            <DrawerData id={hashData} />
          </Drawer>
          {
            isShowDeleteDialog && (
              <OpenDialog
                tableTitle={isDeleteName}
                closeModal={() => closeDialog()
                }
                selectDeleteRecoder={() => handleSelectDeleteRecorder()}
              />
            )}
          {isShowUserDialog && (<MainSettingsComponent id={hashData} setDialogStatus={() => handleUserManagementDialog()} changeImage={(url: string) => changeProfileImage(url)} />)}
        </div>
      </header>)}
    </div>

  );
};

export default Navbar1;
