import { useState, useEffect } from "react";
// next components
import Image from "next/image";

// custom components
import Drawer from "./Drawer";
import DrawerData from "./DrawerData";

// third party components
import { useDuckDb } from "duckdb-wasm-kit";
import { setgpt3_5, setgpt4 } from "@/redux/features/todo-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// images and icons
import HamburgerIcon from "@/assets/images/icons/Hamburger.svg";
import GPT35Icon from "@/assets/images/icons/GPT35.svg";
import GPT4Icon from "@/assets/images/icons/GPT4.svg";
import DropMenuIcon from "@/assets/images/icons/DropMenu.svg";
import LockIcon from "@/assets/images/icons/LockIcon.svg";
import MoreViewIcon from "@/assets/images/icons/MoreView.svg";

const Navbar1 = (props: { id: string }) => {
  const { db, loading, error } = useDuckDb();
  const type = useAppSelector((state) => state.todoReducer.type);
  const duckbook = useAppSelector((state) => state.navbarReducer.data);
  const dispatch = useAppDispatch();

  const [hashData, setHashData] = useState(props.id);
  const [isOpenGPTType, setIsOpenGPTType] = useState(false);
  const [isGPTType, setIsGPTType] = useState(false);
  const [isOpenPrivate, setIsOpenPrivate] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);
  const [fileHandle, setFileHandle] = useState(null);
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
  const closeDropdown = () => {
    setIsOpenGPTType(isOpenGPTType);
  };
  const saveFile = async () => {
    let conn = await db.connect();
    conn.query(
      "EXPORT DATABASE 'new_export.parquet' (FORMAT PARQUET, COMPRESSION ZSTD, ROW_GROUP_SIZE 100000);"
    );
    conn.query(".files download new_export.parquet");

    // const opts = {
    //   types: [
    //     {
    //       description: "Files",
    //     },
    //   ],
    // };
    // const handle = await showSaveFilePicker(opts);
    // try {
    //   await db.export(handle.name);
    //   console.log("DuckDB file exported successfully.");
    // } catch (err) {
    //   console.log("Error exporting DuckDB file:", err);
    // }
    // setFileHandle(handle);
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
                        <button
                          type="button"
                          className="w-full justify-center py-3 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                        >
                          <span className="text-sm text-black">
                            Import DataBook file
                          </span>
                        </button>
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
