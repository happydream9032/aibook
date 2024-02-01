import Image from "next/image";
import { useState, useEffect } from "react";

import LoadDataIcon from "@/assets/images/icons/LoadData.svg";
import SQLIcon from "@/assets/images/icons/SQLIcon.svg";
import ChartIcon from "@/assets/images/icons/ChartIcon.svg";
import GPT4GrayIcon from "@/assets/images/icons/GPT4Gray.svg";
import SampleDataIcon from "@/assets/images/icons/SampleData.svg";
import MarkDownIcon from "@/assets/images/icons/MarkDownIcon.svg";
import ChartTypeIcon from "@/assets/images/icons/ChartTypeIcon.svg";
import MichelinRestaurantIcon from "@/assets/images/icons/MichaelRestaurant.svg";
import YCombinationIcon from "@/assets/images/icons/YCombinatorIcon.svg";
import LeftMoreIcon from "@/assets/images/icons/LeftMoreIcon.svg";

const DropdownModal = (props: {
  closeModal: () => void;
  selectComponentType: (type: number) => void;
  changeDropdownOpen: (bool: boolean) => void;
}) => {
  const [isShowMainDialog, setIsShowMainDialog] = useState(true);
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="h-screen w-screen fixed inset-0"
        onClick={() => props.closeModal()}
      />
      {isShowMainDialog ? (<div className="top-left absolute left-0 shadow-lg rounded-xl bg-white ring-1 ring-black ring-opacity-5 mb-30">
        <div className="w-[500px] px-4">
          <div className="flex items-center justify-center bg-gray-100">
            <div className="w-full bg-white">
              <ul className="flex flex-col w-full">
                <li className="my-px">
                  <span className="flex text-sm text-gray-400 px-3 my-3 uppercase">
                    Suggested
                  </span>
                </li>
                <li className="my-px">
                  <button
                    className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      props.selectComponentType(1);
                      props.changeDropdownOpen(false);
                    }}
                  >
                    <Image
                      src={LoadDataIcon}
                      alt=""
                      width="24"
                      height="24"
                    />
                    <span className="ml-3">Load Data</span>
                  </button>
                </li>
                <li className="my-px">
                  <button
                    className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      props.selectComponentType(2);
                      props.changeDropdownOpen(false);
                    }}
                  >
                    <Image
                      src={SQLIcon}
                      alt=""
                      width="24"
                      height="24"
                    />
                    <span className="ml-3">SQL</span>
                  </button>
                </li>
                <li className="my-px">
                  <button
                    className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      props.selectComponentType(3);
                      props.changeDropdownOpen(false);
                    }}
                  >
                    <Image
                      src={ChartIcon}
                      alt=""
                      width="24"
                      height="24"
                    />
                    <span className="ml-3">Chart</span>
                  </button>
                </li>
                <li className="my-px">
                  <button
                    className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      props.selectComponentType(4);
                      props.changeDropdownOpen(false);
                    }}
                  >
                    <Image
                      src={GPT4GrayIcon}
                      alt=""
                      width="24"
                      height="24"
                    />
                    <span className="ml-3">AI</span>
                  </button>
                </li>
                <li className="my-px">
                  <span className="flex font-medium text-sm text-gray-400 px-4 my-4 uppercase">
                    More
                  </span>
                </li>
                <li className="my-px">
                  <button
                    className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      setIsShowMainDialog(false);
                    }}
                  >
                    <Image
                      src={SampleDataIcon}
                      alt=""
                      width="24"
                      height="24"
                    />
                    <span className="ml-3">Sample Data ...</span>
                  </button>
                </li>
                <li className="my-px">
                  <a
                    href="#"
                    className="flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <Image
                      src={MarkDownIcon}
                      alt=""
                      width="24"
                      height="24"
                    />
                    <span className="ml-3">MarkDown ...</span>
                  </a>
                </li>
                <li className="my-px">
                  <a
                    href="#"
                    className="flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <Image
                      src={ChartTypeIcon}
                      alt=""
                      width="24"
                      height="24"
                    />
                    <span className="ml-3">Chart type ...</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>) : (
        <div className="top-left absolute left-0 shadow-lg rounded-xl bg-white ring-1 ring-black ring-opacity-5">
          <div className="w-[500px] px-4">
            <div className="flex items-center justify-center bg-gray-100">
              <div className="w-full bg-white">
                <ul className="flex flex-col w-full">
                  <li className="my-px">
                    <button
                      className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                      onClick={() => {
                        setIsShowMainDialog(true);
                      }}
                    >
                      <Image
                        className="flex justify-start"
                        src={LeftMoreIcon}
                        alt=""
                        width="20"
                        height="20"
                      />
                      <span className="flex flex-1 justify-center text-xs text-gray-400 px-3 my-3 uppercase">
                        Sample
                      </span>
                    </button>
                  </li>
                  <li className="my-px">
                    <button
                      className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                      onClick={() => {
                        props.selectComponentType(141);
                        props.changeDropdownOpen(false);
                      }}
                    >

                      <Image
                        src={MichelinRestaurantIcon}
                        alt=""
                        width="24"
                        height="24"
                      />
                      <span className="ml-3">Michelin Star Restaurants</span>
                    </button>
                  </li>
                  <li className="my-px">
                    <button
                      className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                      onClick={() => {
                        props.selectComponentType(142);
                        props.changeDropdownOpen(false);
                      }}
                    >
                      <Image
                        src={YCombinationIcon}
                        alt=""
                        width="24"
                        height="24"
                      />
                      <span className="ml-3">Y Combinator Startsup</span>
                    </button>
                  </li>
                  <li className="my-px">
                    <button
                      className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                      onClick={() => {
                        props.selectComponentType(143);
                        props.changeDropdownOpen(false);
                      }}
                    >
                      <Image
                        src={SampleDataIcon}
                        alt=""
                        width="24"
                        height="24"
                      />
                      <span className="ml-3">Business Origination</span>
                    </button>
                  </li>
                  <li className="my-px">
                    <button
                      className="w-full flex flex-row items-center h-10 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                      onClick={() => {
                        props.selectComponentType(144);
                        props.changeDropdownOpen(false);
                      }}
                    >
                      <Image
                        src={SampleDataIcon}
                        alt=""
                        width="24"
                        height="24"
                      />
                      <span className="ml-3">People Dataset</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>)}
    </div>
  );
};

export default DropdownModal;
