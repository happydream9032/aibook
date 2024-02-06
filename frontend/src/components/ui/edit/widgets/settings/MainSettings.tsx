"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import UAParser from 'ua-parser-js';

import DisplayIcon from "@/assets/images/icons/DisplayIcon.svg";
import UserBlackIcon from "@/assets/images/icons/UserBlackIcon.svg";
import UserGrayIcon from "@/assets/images/icons/UserGrayIcon.svg";
import SecurityBlackIcon from "@/assets/images/icons/SecurityBlackIcon.svg"
import SecurityGrayIcon from "@/assets/images/icons/SecurityGrayIcon.svg";
import CloseModalIcon from "@/assets/images/icons/CloseDialog.svg";

const MainSettingsComponent = (props: { id: string; setDialogStatus: () => void; }) => {
  const parser = new UAParser();

  const [userID, setUserID] = useState(props.id);
  const [isStatue, setIsStatus] = useState(0);
  const [isTabType, setIsTabType] = useState(true);
  const [isShowEmailAddressPart, setIsShowEmailAddressPart] = useState(false);
  const [isShowConnectedAccountPart, setIsShowConnectedAccountPart] = useState(false);
  const [isShowDeviceInfoPart, setIsShowDeviceInfoPart] = useState(false);
  const [isHostIPAdress, setIsHostIPAddress] = useState("");
  const [isHostDeviceType, setIsHostDeviceType] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getDeviceInfo();
  }, [isHostDeviceType]);

  const getDeviceInfo = async () => {
    fetch('https://ipapi.co/json/')
      .then(function (response) {
        response.json().then(jsonData => {
          setIsHostIPAddress(jsonData.ip + " (" + jsonData.city + "," + jsonData.country + ")")
          let result = parser.getResult();
          setIsHostDeviceType(result.browser.name + " " + result.browser.version);
          setIsShow(true);
        });
      })
      .then(function (data) {
        console.log(data);
      });
  }

  return (
    <div>{isShow && (<div className="fixed inset-0 bg-gray-600 bg-opacity-50 h-screen w-screen flex items-center justify-center z-30">
      <div className="border shadow-lg shadow-lg rounded-lg bg-white h-[600px]">
        <div className="flex flex-row align-stretch justify-start bg-white w-[880px] rounded-lg h-full " >
          <div className="p-10 px-5 flex flex-col align-stretch  justify-start w-[220px] h-full px-2 z-40 border-r-2 border-gray-300">
            <Link href="#account" className="py-3 px-3 rounded-md font-bold text-gray-500 focus:text-black align-center inline-flex justify-start bg-white focus:bg-gray-100 focus:border border-indigo-400 hover:bg-gray-200" onClick={() => { setIsTabType(true); setIsStatus(0); }}>
              <Image
                src={isTabType ? UserBlackIcon : UserGrayIcon}
                alt="google"
                width={16}
                height={16}
                className="mt-1 mr-6"
              />
              Account
            </Link>
            <Link href="#security" className="py-3 px-3 rounded-md font-bold text-gray-500 focus:text-black align-center inline-flex justify-start bg-white focus:bg-gray-100 focus:border border-indigo-400 hover:bg-gray-200" onClick={() => { setIsTabType(false); setIsStatus(0); }}>
              <Image
                src={isTabType ? SecurityGrayIcon : SecurityBlackIcon}
                alt="google"
                width={16}
                height={16}
                className="mt-1 mr-6"
              />
              Security
            </Link>
          </div>
          <div className="w-[660px] flex flex-col outline-none overflow-auto relative">
            <button className="flex justify-end px-2 py-2" onClick={() => { props.setDialogStatus(); }}>
              <Image src={CloseModalIcon} alt="close" width={24} height={24} />
            </button>
            {isStatue == 0 ? (<div><section id="account" className="w-full border-l-2 border-gray-300">
              <div className="w-full justify-start px-8 py-5">
                <h1 className="text-3xl mb-2 font-bold text-black">Account</h1>
                <h1 className="text-gray-500">Manage your account information</h1>
                <div className="flex flex-col w-full py-8">
                  <span className="w-full mb-2 flex-col text-black font-medium border-b-2 border-gray-100">Profile</span>
                  <button className="w-full bg-white hover:bg-gray-100 py-3 mb-3">
                    <div className="flex justify-start ">
                      <div className="relative ml-5 inline-flex items-center justify-center w-14 h-14 overflow-hidden bg-lime-950 rounded-full">
                        <span className="font-medium text-3xl text-white">JL</span>
                      </div>
                      <span className="font-medium px-5 py-3 item-center text-lg text-gray-700">James Lee</span>
                    </div>
                  </button>
                  <span className="w-full mb-2 flex-col text-black font-medium border-b-2 border-gray-100">Email addresses</span>
                  <button className="flex text-gray-500 bg-gray-100 hover:bg-gray-300 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2.5 text-left inline-flex items-center" type="button" data-dropdown-toggle="dropdown" onClick={() => { setIsShowEmailAddressPart(!isShowEmailAddressPart) }}>
                    <span className="flex justify-start">happydream9032@gmail.com<span className="ml-4 bg-indigo-100 text-indigo-500 text-sm font-medium me-2 px-2.5 py-0.5 rounded">Primary</span></span>
                  </button>
                  {isShowEmailAddressPart && (<div className="w-full ml-5 bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4" id="dropdown">
                    <ul className="py-1" aria-labelledby="dropdown">
                      <li>
                        <a href="#" className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">
                          <span className="ml-5block text-sm text-black">Primary email address</span>
                          <span className="block text-sm font-medium text-gray-400 truncate">This email address is the primary email address</span>
                          <span className="block text-sm text-black mt-3">Remove</span>
                          <span className="block text-sm font-medium text-gray-400 truncate">Delete this email address and remove it from your account</span>
                          <button className="text-sm hover:bg-gray-100 text-red-400 block py-2" onClick={() => { setIsStatus(2) }}>
                            <span className="block text-sm">Remove email address</span>
                          </button>
                        </a>
                      </li>
                    </ul>
                  </div>)}
                  <button className="w-full bg-white rounded-md hover:bg-indigo-200 mt-3 py-3 px-3">
                    <div className="flex justify-start ">
                      <button className="font-medium text-sm text-indigo-500" onClick={() => { setIsStatus(1) }}><span className="mr-3 font-bold text-sm text-indigo-500">+</span>Add an email address</button>
                    </div>
                  </button>
                  <span className="w-full mb-2 mt-5 flex-col text-black font-medium border-b-2 border-gray-100">Connected Account</span>
                  <button className="flex text-gray-500 bg-gray-100 focus:border border-indigo-300 hover:bg-gray-300 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2.5 text-left inline-flex items-center" type="button" data-dropdown-toggle="dropdown" onClick={() => { setIsShowConnectedAccountPart(!isShowConnectedAccountPart) }}>
                    <span className="flex justify-start"><Image
                      src="/images/google.svg"
                      alt="google"
                      width={16}
                      height={16}
                      className="w-auto mr-6"
                    />Google (happydream9032@gmail.com)</span>
                  </button>
                  {isShowConnectedAccountPart && (<div className="w-full ml-5 bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4" id="dropdown">
                    <ul className="py-1" aria-labelledby="dropdown">
                      <li>
                        <a href="#" className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">
                          <div className="flex justify-start">
                            <div className="relative inline-flex items-center justify-center w-14 h-14 overflow-hidden bg-lime-950 rounded-full">
                              <span className="font-medium text-3xl text-white">JL</span>
                            </div>
                            <div className="flex flex-col flex-1">
                              <span className="font-medium px-5 py-1 item-center text-sm text-gray-700">James Lee</span>
                              <span className="font-medium px-5 py-1 item-center text-sm text-gray-400">happydream9032@gmail.com</span>
                            </div>

                          </div>
                          <span className="block text-sm text-black mt-3">Remove</span>
                          <span className="block text-sm font-medium text-gray-400 truncate">Remove this connected account from your account</span>
                          <button className="text-sm hover:bg-gray-100 text-red-400 block py-2" onClick={() => { setIsStatus(3) }}>
                            <span className="block text-sm">Remove connected address</span>
                          </button>
                        </a>
                      </li>
                    </ul>
                  </div>)}
                  <button className="w-full bg-white rounded-md hover:bg-indigo-200 mt-3 py-3 px-3">
                    <div className="flex justify-start ">
                      <span className="font-medium text-sm text-indigo-500"><span className="mr-3 font-bold text-sm text-indigo-500">+</span>Connect Account</span>
                    </div>
                  </button>
                </div>
              </div>
            </section>
              <section id="security" className="w-full border-l-2 border-gray-300">
                <div className="w-full justify-start px-8 py-5">
                  <h1 className="text-3xl mb-2 font-bold text-black">Account</h1>
                  <h1 className="text-gray-500">Manage your account information</h1>
                  <div className="flex flex-col w-full py-8">
                    <span className="w-full mb-4 flex-col text-black font-medium border-b-2 border-gray-100">Email addresses</span>
                    <button className="flex mb-6 text-gray-500 bg-gray-100 hover:bg-gray-300 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2.5 text-left inline-flex items-center" type="button" onClick={() => { setIsStatus(4); }}>
                      <span className="flex justify-start text-sm text-indigo-500"><span className="flex text-sm text-indigo-500 mr-3">+</span>Set password</span>
                    </button>
                    <span className="w-full my-4 flex-col text-black font-medium border-b-2 border-gray-100">Active devices</span>
                    <button className="flex text-gray-500 bg-gray-100 hover:bg-gray-300 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2.5 text-left inline-flex items-center" type="button" onClick={() => { setIsShowDeviceInfoPart(!isShowDeviceInfoPart) }}>
                      <Image
                        src={DisplayIcon}
                        alt=""
                        width="80"
                        height="80"
                      />
                      <div className="flex flex-col gap-2 ml-4">
                        <span className="text-black">Window<span className="ml-4 bg-indigo-100 text-indigo-500 text-sm font-medium me-2 px-2.5 py-0.5 rounded">This Device</span></span>
                        <span className="text-gray-400">{isHostDeviceType}</span>
                        <span className="text-gray-400">{isHostIPAdress}</span>
                        <span className="text-gray-400">Today at 4.21 PM</span>
                      </div>
                    </button>
                    {isShowDeviceInfoPart && (<div className="w-full flex flex-col ml-5 bg-white text-base z-50 my-4 gap-2">
                      <span className="ml-5 text-sm text-black">Current Device</span>
                      <span className="ml-5 text-sm font-medium text-gray-400 truncate">This is the device you are currently using</span>
                    </div>)}
                  </div>
                </div>
              </section></div>) : isStatue === 1 ? (<section id="add_email" className="w-full">
                <div className="w-full flex flex-col gap-1 justify-start px-8 py-5">
                  <h1 className="text-3xl mb-4 font-bold text-black">Add email address</h1>
                  <span className="text-sm text-gray-800">Email address</span>
                  <input className="text-sm py-2 px-2 border border-gray-500 focus:border-indigo-400 rounded-md mb-5" type="text" />
                  <span className="text-sm mb-2 text-gray-700">An email containing a verification code will be sent to this email address.</span>
                  <div className="flex justify-end gap-3">
                    <button className="px-4 py-3 rounded-md text-sm text-indigo-500 bg-white hover:bg-indigo-200">Cancel</button>
                    <button className="px-4 py-3 rounded-md text-sm text-white bg-indigo-500 hover:bg-indigo-700">Continue</button>
                  </div>
                </div>
              </section>) : isStatue === 2 ? (<section id="remove_email" className="w-full">
                <div className="w-full flex flex-col gap-1 justify-start px-8 py-5">
                  <h1 className="text-3xl mb-4 font-bold text-black">Remove email address</h1>
                  <span className="text-sm mb-2 text-gray-700">happydream9032@gmail.com will be removed from this account.</span>
                  <span className="text-sm mb-2 text-gray-700">You will no longer be able to sign in using this email address.</span>
                  <div className="flex justify-end gap-3">
                    <button className="px-4 py-3 rounded-md text-sm text-indigo-500 bg-white hover:bg-indigo-200">Cancel</button>
                    <button className="px-4 py-3 rounded-md text-sm text-white bg-red-500 hover:bg-red-700">Continue</button>
                  </div>
                </div>
              </section>) : isStatue === 3 ? (<section id="remove_connect" className="w-full">
                <div className="w-full flex flex-col gap-1 justify-start px-8 py-5">
                  <h1 className="text-3xl mb-4 font-bold text-black">Remove connected account</h1>
                  <span className="text-sm mb-2 text-gray-700">Google will be removed from this account.</span>
                  <span className="text-sm mb-2 text-gray-700">You will no longer be able to use this connected account and any dependent features will no longer work.</span>
                  <div className="flex justify-end gap-3">
                    <button className="px-4 py-3 rounded-md text-sm text-indigo-500 bg-white hover:bg-indigo-200">Cancel</button>
                    <button className="px-4 py-3 rounded-md text-sm text-white bg-red-500 hover:bg-red-700">Continue</button>
                  </div>
                </div>
              </section>) : isStatue === 4 ? (<section id="set_password" className="w-fullz">
                <div className="w-full flex flex-col gap-1 justify-start px-8 py-5">
                  <h1 className="text-3xl mb-4 font-bold text-black">Add email address</h1>
                  <span className="text-sm text-gray-800">New password</span>
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder={""}
                    required={true}
                    className="text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
                  />

                  <span className="text-sm text-gray-800">Confirm password</span>
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder={""}
                    required={true}
                    className="text-md block px-3 py-2 mb-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
                  />

                  <div className="flex items-center mb-4">
                    <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-indigo-500 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800" />
                    <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900">Sign out of all other devices</label>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button className="px-4 py-3 rounded-md text-sm text-indigo-500 bg-white hover:bg-indigo-200">Cancel</button>
                    <button className="px-4 py-3 rounded-md text-sm text-white bg-indigo-500 hover:bg-indigo-700">Continue</button>
                  </div>
                </div>
              </section>) : (<div></div>)}
          </div>

        </div>
      </div>

    </div>)}</div>
  );
}
export default MainSettingsComponent;