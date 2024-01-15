import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import Drawer from "./Drawer";
import Data from "./DrawerData";

const Navbar1 = () => {
  const [isOpenGPTType, setIsOpenGPTType] = useState(false);
  const [isGPTType, setIsGPTType] = useState(false);
  const [isOpenPrivate, setIsOpenPrivate] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);
  const isEnableOverlay: boolean = false;

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
  const changeGPTType = () => {
    setIsGPTType(!isGPTType);
  };

  return (
    <div className="py-2 px-5 z-40 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-3xl">
      <div className="relative flex items-center justify-between">
        <div>
          <button
            className="mantine-prepend-UnstyledButton-root mantine-prepend-ActionIcon-root mantine-prepend-k9xdt9"
            type="button"
            data-state="closed"
            title={""}
            onClick={toggleSidebar}
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M4 6l16 0"></path>
              <path d="M4 12l16 0"></path>
              <path d="M4 18l16 0"></path>
            </svg>
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
            Hello Duckbook !
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
                  <svg
                    className="pl-1"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"></path>
                  </svg>
                ) : (
                  <svg
                    className="pl-1"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"></path>
                  </svg>
                )}

                {isGPTType ? <span> GPT-3.5 </span> : <span> GPT-4 </span>}
                <svg
                  className="w-2.5 h-2.5 ml-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {isOpenGPTType && (
                <div className="top-center absolute right-0 mt-2 py-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
                        }}
                      >
                        <div className="grid grid-cols-6">
                          <div className="col-start-1 col-end-1">
                            <svg
                              className="text-indigo-500 p1-1"
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              height="24"
                              width="24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              ></path>
                              <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"></path>
                            </svg>{" "}
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
                        }}
                      >
                        <div className="grid grid-cols-6">
                          <div className="col-start-1 col-end-1">
                            <svg
                              className="text-indigo-500 p1-1"
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              height="24"
                              width="24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              ></path>
                              <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"></path>
                            </svg>{" "}
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
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
                <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
                <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
              </svg>
            </button>

            {isOpenPrivate && (
              <div className="top-center absolute right-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="w-[200px] px-4 py-4">
                  <span className="text-base">
                    This doc is <strong>Private</strong>.
                    <br />
                    <br />
                    Data is stored locally on your device, not sent to a server.
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
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                  <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                </svg>
              </button>

              {isOpenSetting && (
                <div className="top-center absolute right-0 mt-2 py-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
                      >
                        <span className="text-sm text-black">
                          Export Duckbook file
                        </span>
                      </button>
                    </li>
                    <li role="menuitem">
                      <button
                        type="button"
                        className="w-full justify-center py-3 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                      >
                        <span className="text-sm text-black">
                          Import Duckbook file
                        </span>
                      </button>
                    </li>
                    <li role="menuitem">
                      <button
                        type="button"
                        className="w-full justify-center py-3 text-gray-400 bg-white hover:bg-gray-100 round-lg font-medium text-sm inline-flex items-center"
                      >
                        <span className="text-sm text-red-600">Delete Doc</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Drawer isOpen={isSidebarOpen} setIsOpen={toggleSidebar}>
        <Data />
      </Drawer>
    </div>
  );
};

export default Navbar1;
