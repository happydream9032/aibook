"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import UAParser from 'ua-parser-js';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setUserState } from "@/redux/features/user-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import DisplayIcon from "@/assets/images/icons/DisplayIcon.svg";
import UserBlackIcon from "@/assets/images/icons/UserBlackIcon.svg";
import UserGrayIcon from "@/assets/images/icons/UserGrayIcon.svg";
import SecurityBlackIcon from "@/assets/images/icons/SecurityBlackIcon.svg"
import SecurityGrayIcon from "@/assets/images/icons/SecurityGrayIcon.svg";
import CloseModalIcon from "@/assets/images/icons/CloseDialog.svg";
import ShowPasswordIcon from "@/assets/images/icons/ShowPasswordIcon.svg";
import HidePasswordIcon from "@/assets/images/icons/HidePasswordIcon.svg";

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

const EmailSmallPart = (props: { email: string, verify_status: number, propsStatus: any }) => {
  const [isShowEmailAddressPart, setIsShowEmailAddressPart] = useState(false);
  return (<div>
    <button className="flex w-full text-gray-500 bg-gray-100 hover:bg-gray-300 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2.5 text-left inline-flex items-center"
      type="button"
      data-dropdown-toggle="dropdown"
      onClick={() => { setIsShowEmailAddressPart(!isShowEmailAddressPart) }}>
      <span className="flex justify-start">{props.email}
        {props.verify_status == 0 ? (<span className="ml-4 bg-red-100 text-red-700 text-sm font-medium me-2 px-2.5 py-0.5 rounded">Unverified</span>) : (<span className="ml-4 bg-indigo-100 text-indigo-500 text-sm font-medium me-2 px-2.5 py-0.5 rounded">Primary</span>)}
      </span>
    </button>
    {
      isShowEmailAddressPart && (<div className="w-full ml-5 bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4" id="dropdown">
        <ul className="py-1" aria-labelledby="dropdown">
          <li>
            <a href="#" className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">
              {props.verify_status == 0 ? (
                <div>
                  <span className="ml-5block text-sm text-black">Verify email address</span>
                  <span className="block text-sm font-medium text-gray-400 truncate">Complete verification to access all features with this email address</span>
                  <button className="block text-sm bg-white font-medium text-indigo-500 truncate" onClick={() => { props.propsStatus(5) }}>Verify email address</button>
                </div>
              ) : (
                <div>
                  <span className="ml-5block text-sm text-black">Primary email address</span>
                  <span className="block text-sm font-medium text-gray-400 truncate">This email address is the primary email address</span>
                </div>)}
              {/* <div>
                <span className="ml-5block text-sm text-black">Verify email address</span>
                <span className="block text-sm font-medium text-gray-400 truncate">Complete verification to access all features with this email address</span>
                <button className="block text-sm bg-white font-medium text-indigo-500 truncate" onClick={() => { props.propsStatus(5) }}>Verify email address</button>
              </div> */}
              <span className="block text-sm text-black mt-3">Remove</span>
              <span className="block text-sm font-medium text-gray-400 truncate">Delete this email address and remove it from your account</span>
              <button className="text-sm hover:bg-gray-100 text-red-400 block py-2" onClick={() => { props.propsStatus(2) }}>
                <span className="block text-sm">Remove email address</span>
              </button>
            </a>
          </li>
        </ul>
      </div>)
    }
  </div>)
}

const MainSettingsComponent = (props: { id: string; setDialogStatus: () => void; changeImage: (url: string) => void; }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isUserInfo, setUserInfo] = useState<User_Info>({
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
  const [isStatue, setIsStatus] = useState(0);
  const [isTabType, setIsTabType] = useState(true);

  const [isShowEmailAddressPart, setIsShowEmailAddressPart] = useState(false);
  const [isShowConnectedAccountPart, setIsShowConnectedAccountPart] = useState(false);
  const [isShowDeviceInfoPart, setIsShowDeviceInfoPart] = useState(false);
  const [isShowImageUploadComponent, setIsShowImageUploadComponent] = useState(false);

  const [isUserList, setIsUserList] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [code, setCode] = useState("");

  const [isPreImageFileName, setIsPreImageFileName] = useState("");
  const [isNewImageFileName, setIsNewImageFileName] = useState("");
  const [isCurrentPassword, setIsCurrentPassword] = useState("");
  const [isNewPassword, setIsNewPassword] = useState("");
  const [isConfirmPassword, setIsConfirmPassword] = useState("");
  const [isCurrentPasswordShow, setIsCurrentPasswordShow] = useState(false);
  const [isNewPasswordShow, setIsNewPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);
  const [isNewEmailAddress, setIsNewEmailAddress] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    let user_info: any = localStorage.getItem("user_data");
    setUserInfo(JSON.parse(user_info));
    handleGetAllEmails();
  }, []);

  useEffect(() => {
    if (isUserList.length > 0) {
      setIsShow(true);
    }
  }, [isUserList]);

  const addNewEmailAddress = async () => {
    let json_data = {
      USER_ID: isUserInfo.id,
      EMAIL: isNewEmailAddress,
      PASSWORD: isUserInfo.password,
      STATUS: 0,
      IMAGE: isUserInfo.image,
      CREATE_AT: isUserInfo.create_at,
      LOGIN_TYPE: isUserInfo.login_type,
      IP_ADDRESS: isUserInfo.ip_address,
      IP_LOCATION: isUserInfo.ip_location,
      TYPE: 2
    }

    let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/signup";
    await axios
      .post(update_apiUrl, json_data)
      .then((response) => {
        if (response.data.code === 200) {
          setIsStatus(5)
        } else if (response.data.code === 403) {
          console.log("403")
          toast.error("This email is used already!", { position: "top-right" });
        } else if (response.data.code === 401) {
          console.log("401")
          toast.error("Not Find user info!", { position: "top-right" });
        }
      })
      .catch((error) => {
        console.error("Error18:", error.message);
      });
  }
  const handleResendCode = async () => {
    try {
      let data = {
        USER_ID: isUserInfo.id,
        EMAIL: isNewEmailAddress,
        TYPE: 1
      }
      let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/resetOTPcode";
      await axios
        .post(update_apiUrl, data)
        .then((response) => {
          console.log("update response is", response.data);
          if (response.data.code === 200) {
            setCode("");
            let json_data = {
              email: isNewEmailAddress,
              token: response.data.data
            }
            localStorage.setItem("user_authenticate", JSON.stringify(json_data));
          } else {
            toast.error("Failure Resending!", { position: "top-right" });
          }
        })
        .catch((error) => {
          console.error("Error19:", error.message);
          // Handle the error
        });
    } catch (err: any) {
      console.log(err)
    }
  }
  const handleCodeSubmit = async () => {
    try {
      let temp: any = localStorage.getItem("user_authenticate")
      let user = JSON.parse(temp);
      let data = {
        EMAIL: isNewEmailAddress,
        TOKEN: user["token"]
      }
      let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/verify";
      await axios
        .post(update_apiUrl, data)
        .then((response) => {
          console.log("update response is", response.data);
          if (response.data.code === 200) {
            setIsNewEmailAddress("");
            setIsStatus(0);
            setCode("");
            toast.success("User Registered!", { position: "top-right" });
          } else if (response.data.code === 401) {
            toast.error("Token is expired!", { position: "top-right" });
          } else if (response.data.code === 403) {
            toast.error("Failure verification!", { position: "top-right" });
          }
        })
        .catch((error) => {
          console.error("Error19:", error.message);
          // Handle the error
        });
    } catch (err: any) {
      toast.error("Failure verification!", { position: "top-right" });
    }
  }
  const handleGetAllEmails = async () => {
    try {
      let temp: any = localStorage.getItem("user_data")
      let user_info: any = JSON.parse(temp);
      setIsShow(false);
      let data = {
        USER_ID: user_info.id
      }
      console.log("get all emails of data is", data);
      let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/getUsersbyID";
      await axios
        .post(update_apiUrl, data)
        .then((response) => {
          if (response.data.length > 0) {
            console.log(response.data, response.data.length);
            setIsUserList(response.data);
          }
        })
        .catch((error) => {
          console.error("Error19:", error.message);
          // Handle the error
        });
    } catch (err: any) {
      toast.error("Failure verification!", { position: "top-right" });
    }
  }
  const handleChangePassword = async () => {
    if (isNewPassword === "" || isConfirmPassword === "" || isNewPassword !== isConfirmPassword) {
      toast.error("Check your password informations", { position: "top-right" });
      alert("Check your password informations");
    } else {
      if (isCurrentPassword === "" && isUserInfo.password !== "") {
        toast.error("Check your password informations", { position: "top-right" });
        alert("Check your password informations1");
      } else {
        let data = {
          ID: isUserInfo.id,
          CURRENT_PASSWORD: isCurrentPassword,
          NEW_PASSWORD: isNewPassword
        }
        let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/changepassword";
        await axios
          .post(update_apiUrl, data)
          .then((response) => {
            if (response.data.code === 200) {
              setUserInfo((isUserInfo) => ({ ...isUserInfo, password: isNewPassword }));
              setIsConfirmPassword("");
              setIsNewPassword("");
              setIsConfirmPassword("");

              let user_info = isUserInfo;
              user_info.password = isNewPassword;
              dispatch(setUserState(user_info));
              localStorage.setItem("user_data", JSON.stringify(user_info));
              alert(response.data.message);
              if (isDisabled === true) {
                dispatch(setUserState({}));
                localStorage.removeItem("user_data");
                router.push("/sign-in");
              }
            } else {
              alert("changing password is failured!")
            }
          })
          .catch((error) => {
            console.error("Error19:", error.message);
          });
      }
    }
  }
  const handleFileChange = async (e: any) => {
    let imagefile = e.target.files[0];
    if (imagefile != null) {
      console.log(imagefile.name);
      let formData = new FormData();
      setIsPreImageFileName(isUserInfo.image)
      setIsNewImageFileName(imagefile.name)
      formData.append('file', imagefile);

      let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/uploads";
      await axios
        .post(update_apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          if (response.data.code === 200) {
            setUserInfo((isUserInfo) => ({ ...isUserInfo, image: imagefile.name }));
          }
        })
        .catch((error) => {
          console.error("Error19:", error.message);
          // Handle the error
        });
    }
  }
  const saveFileChange = async () => {
    let data = {
      ID: isUserInfo.id,
      FILENAME: isNewImageFileName
    }
    console.log("123446", data)
    let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/changeavatar";
    await axios
      .post(update_apiUrl, data)
      .then((response) => {
        if (response.data.code === 200) {
          setUserInfo((isUserInfo) => ({ ...isUserInfo, image: isNewImageFileName }));
          setIsPreImageFileName(isNewImageFileName);
          props.changeImage(isNewImageFileName);
          let user_info = isUserInfo;
          user_info.image = isNewImageFileName;
          dispatch(setUserState(user_info));
          localStorage.setItem("user_data", JSON.stringify(user_info));
          console.log(isUserInfo);
          setIsStatus(0);
        }
      })
      .catch((error) => {
        console.error("Error19:", error.message);
        // Handle the error
      });
  }
  const cancelFileChange = async () => {
    setUserInfo((isUserInfo) => ({ ...isUserInfo, image: isPreImageFileName }));
    props.changeImage(isPreImageFileName);
    setIsStatus(0);
  }
  const handleRemoveUser = async (email: string) => {
    let data = {
      USER_ID: isUserInfo.id,
      EMAIL: email
    }
    let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/deleteuser";
    await axios
      .post(update_apiUrl, data)
      .then((response) => {
        if (response.data.code === 200) {
          if (email === isUserInfo.email) {
            dispatch(setUserState({}));
            localStorage.removeItem("user_data");
            router.push("/");
          }
        }
      })
      .catch((error) => {
        console.error("Error19:", error.message);
        // Handle the error
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
            {isStatue == 0 ?
              (<div><section id="account" className="w-full border-l-2 border-gray-300">
                <div className="w-full justify-start px-8 py-5">
                  <h1 className="text-3xl mb-2 font-bold text-black">Account</h1>
                  <h1 className="text-gray-500">Manage your account information</h1>
                  <div className="flex flex-col w-full py-8">
                    <span className="w-full mb-2 flex-col text-black font-medium border-b-2 border-gray-100">Profile</span>
                    <button className="w-full bg-white hover:bg-gray-100 py-3 mb-3" onClick={() => { setIsStatus(6); }}>
                      <div className="flex justify-start ">
                        {isUserInfo.image === "" ? (
                          <div className="relative ml-5 inline-flex items-center justify-center w-14 h-14 overflow-hidden bg-lime-950 rounded-full">
                            <span className="font-medium text-3xl text-white">{isUserInfo.name.charAt(0)}</span>
                          </div>
                        ) : (
                          <Image className="ml-3" src={process.env.NEXT_PUBLIC_API_BASE_URL + "/files/" + isUserInfo.image} alt="close" width={60} height={14} />
                        )}
                        <span className="font-medium px-5 py-3 item-center text-lg text-gray-700">{isUserInfo.name}</span>
                      </div>
                    </button>
                    <span className="w-full mb-2 flex-col text-black font-medium border-b-2 border-gray-100">Email addresses</span>

                    {isUserList.map((item: any, index: number) => (
                      <div key={index} className="relative w-full mb-3 "><EmailSmallPart email={item[2]} verify_status={item[4]} propsStatus={setIsStatus} /></div>
                    ))}

                    <button className="w-full bg-white rounded-md hover:bg-indigo-200 mt-3 py-3 px-3">
                      <div className="flex justify-start ">
                        <button className="font-medium text-sm text-indigo-500" onClick={() => { setIsStatus(1); }}><span className="mr-3 font-bold text-sm text-indigo-500">+</span>Add an email address</button>
                      </div>
                    </button>
                    <span className="w-full mb-2 mt-5 flex-col text-black font-medium border-b-2 border-gray-100">Connected Account</span>
                    {isUserInfo.login_type == 1 && (<button className="flex text-gray-500 bg-gray-100 focus:border border-indigo-300 hover:bg-gray-300 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2.5 text-left inline-flex items-center" type="button" data-dropdown-toggle="dropdown" onClick={() => { setIsShowConnectedAccountPart(!isShowConnectedAccountPart) }}>
                      <span className="flex justify-start"><Image
                        src="/images/google.svg"
                        alt="google"
                        width={16}
                        height={16}
                        className="w-auto mr-6"
                      />Google ({isUserInfo.email})</span>
                    </button>)}
                    {isShowConnectedAccountPart && (<div className="w-full ml-5 bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4" id="dropdown">
                      <ul className="py-1" aria-labelledby="dropdown">
                        <li>
                          <a href="#" className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2">
                            <div className="flex justify-start">
                              {isUserInfo.image === "" ? (
                                <div className="relative ml-5 inline-flex items-center justify-center w-14 h-14 overflow-hidden bg-lime-950 rounded-full">
                                  <span className="font-medium text-3xl text-white">{isUserInfo.name.charAt(0)}</span>
                                </div>
                              ) : (
                                <Image src={process.env.NEXT_PUBLIC_API_BASE_URL + "/files/" + isUserInfo.image} alt="close" width={14} height={14} />
                              )}
                              <div className="flex flex-col flex-1">
                                <span className="font-medium px-5 py-1 item-center text-sm text-gray-700">{isUserInfo.name}</span>
                                <span className="font-medium px-5 py-1 item-center text-sm text-gray-400">{isUserInfo.email}</span>
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
                          <span className="text-gray-400">{isUserInfo?.ip_location}</span>
                          <span className="text-gray-400">{isUserInfo?.ip_address}</span>
                          <span className="text-gray-400">Today at 4.21 PM</span>
                        </div>
                      </button>
                      {isShowDeviceInfoPart && (<div className="w-full flex flex-col ml-5 bg-white text-base z-50 my-4 gap-2">
                        <span className="ml-5 text-sm text-black">Current Device</span>
                        <span className="ml-5 text-sm font-medium text-gray-400 truncate">This is the device you are currently using</span>
                      </div>)}
                    </div>
                  </div>
                </section></div>) :
              isStatue === 1 ? (
                <section id="add_email" className="w-full">
                  <div className="w-full flex flex-col gap-1 justify-start px-8 py-5">
                    <h1 className="text-3xl mb-4 font-bold text-black">Add email address</h1>
                    <span className="text-sm text-gray-800">Email address</span>
                    <input className="text-sm py-2 px-2 border border-gray-500 focus:border-indigo-400 rounded-md mb-5"
                      type="email"
                      required={true}
                      onChange={(e) => { setIsNewEmailAddress(e.currentTarget.value) }} />
                    <span className="text-sm mb-2 text-gray-700">An email containing a verification code will be sent to this email address.</span>
                    <div className="flex justify-end gap-3">
                      <button className="px-4 py-3 rounded-md text-sm text-indigo-500 bg-white hover:bg-indigo-200">Cancel</button>
                      <button className="px-4 py-3 rounded-md text-sm text-white bg-indigo-500 hover:bg-indigo-700"
                        onClick={() => { addNewEmailAddress(); }}>Continue</button>
                    </div>
                  </div>
                </section>) :
                isStatue === 2 ? (
                  <section id="remove_email" className="w-full">
                    <div className="w-full flex flex-col gap-1 justify-start px-8 py-5">
                      <h1 className="text-3xl mb-4 font-bold text-black">Remove email address</h1>
                      <span className="text-sm mb-2 text-gray-700">{isUserInfo.email} will be removed from this account.</span>
                      <span className="text-sm mb-2 text-gray-700">You will no longer be able to sign in using this email address.</span>
                      <div className="flex justify-end gap-3">
                        <button className="px-4 py-3 rounded-md text-sm text-indigo-500 bg-white hover:bg-indigo-200">Cancel</button>
                        <button className="px-4 py-3 rounded-md text-sm text-white bg-red-500 hover:bg-red-700" onClick={() => { handleRemoveUser(isUserInfo.email) }}>Continue</button>
                      </div>
                    </div>
                  </section>) :
                  isStatue === 3 ? (
                    <section id="remove_connect" className="w-full">
                      <div className="w-full flex flex-col gap-1 justify-start px-8 py-5">
                        <h1 className="text-3xl mb-4 font-bold text-black">Remove connected account</h1>
                        <span className="text-sm mb-2 text-gray-700">Google will be removed from this account.</span>
                        <span className="text-sm mb-2 text-gray-700">You will no longer be able to use this connected account and any dependent features will no longer work.</span>
                        <div className="flex justify-end gap-3">
                          <button className="px-4 py-3 rounded-md text-sm text-indigo-500 bg-white hover:bg-indigo-200">Cancel</button>
                          <button className="px-4 py-3 rounded-md text-sm text-white bg-red-500 hover:bg-red-700">Continue</button>
                        </div>
                      </div>
                    </section>) :
                    isStatue === 4 ? (
                      <section id="set_password" className="w-fullz">
                        <div className="w-full flex flex-col gap-1 justify-start px-8 py-5">
                          <h1 className="text-3xl mb-4 font-bold text-black">Add email address</h1>
                          {isUserInfo.password === "" ? (
                            <div></div>
                          ) : (
                            <div>
                              <span className="text-sm text-gray-800">Current password</span>
                              <div className="relative">
                                <input
                                  type={isCurrentPasswordShow ? "text" : "password"}
                                  name="password"
                                  id="password"
                                  placeholder={""}
                                  required={true}
                                  onChange={(e) => { setIsCurrentPassword(e.currentTarget.value) }}
                                  className="text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
                                />
                                <button type="submit" className="text-white absolute end-2.5 bottom-1.5 bg-white hover:bg-gray-100 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-2" onClick={() => { setIsCurrentPasswordShow(!isCurrentPasswordShow) }}>
                                  <Image src={isCurrentPasswordShow ? ShowPasswordIcon : HidePasswordIcon} width={20} height={20} alt={"current pwd"} />
                                </button>
                              </div>
                            </div>
                          )}
                          <span className="text-sm text-gray-800">New password</span>
                          <div className="relative">
                            <input
                              type={isNewPasswordShow ? "text" : "password"}
                              name="password"
                              id="password"
                              placeholder={""}
                              required={true}
                              onChange={(e) => { setIsNewPassword(e.currentTarget.value) }}
                              className="text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
                            />
                            <button type="submit" className="text-white absolute end-2.5 bottom-1.5 bg-white hover:bg-gray-100 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-2" onClick={() => { setIsNewPasswordShow(!isNewPasswordShow) }}>
                              <Image src={isNewPasswordShow ? ShowPasswordIcon : HidePasswordIcon} width={20} height={20} alt={"new pwd"} />
                            </button>
                          </div>
                          <span className="text-sm text-gray-800">Confirm password</span>
                          <div className="relative">
                            <input
                              type={isConfirmPasswordShow ? "text" : "password"}
                              name="password"
                              id="password"
                              placeholder={""}
                              required={true}
                              onChange={(e) => { setIsConfirmPassword(e.currentTarget.value) }}
                              className="text-md block px-3 py-2 mb-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
                            />
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-white hover:bg-gray-100 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-2" onClick={() => { setIsConfirmPasswordShow(!isConfirmPasswordShow) }}>
                              <Image src={isConfirmPasswordShow ? ShowPasswordIcon : HidePasswordIcon} width={20} height={20} alt={"new pwd"} />
                            </button>
                          </div>
                          <div className="flex items-center mb-4">
                            <input type="checkbox" checked={isDisabled} onChange={() => { setIsDisabled(!isDisabled) }} className="w-4 h-4 text-indigo-500 bg-gray-100 rounded" />
                            <label className="ms-2 text-sm font-medium text-gray-900">Sign out of all other devices</label>
                          </div>
                          <div className="flex justify-end gap-3">
                            <button className="px-4 py-3 rounded-md text-sm text-indigo-500 bg-white hover:bg-indigo-200">Cancel</button>
                            <button className="px-4 py-3 rounded-md text-sm text-white bg-indigo-500 hover:bg-indigo-700" onClick={() => { handleChangePassword() }}>Continue</button>
                          </div>
                        </div>
                      </section>) :
                      isStatue === 5 ? (
                        <section id="verify_otp" className="w-full">
                          <div className="w-full flex flex-col gap-1 justify-start px-8 py-5">
                            <h1 className="text-3xl mb-4 font-bold text-black">Add email address</h1>
                            <div className="flex flex-col">
                              <span className="flex justify-start block mb-2 text-sm font-medium text-gray-900"> Verification code </span>
                              <span className="flex justify-start block mb-2 text-sm font-medium text-gray-500"> Enter the verification code sent to your email address </span>
                            </div>
                            <div className="flex flex-col gap-6">
                              <input
                                type="number"
                                name="otp_number"
                                placeholder="356263"
                                className="text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
                                required={true}
                                value={code}
                                onChange={(e) => { setCode(e.currentTarget.value) }}
                              />
                            </div>
                            <button className="flex w-full items-center justify-center rounded-md bg-white border-2 border-indigo-600 px-5 py-2 text-base font-medium text-gray-700 shadow-submit duration-300 hover:bg-gray-400" onClick={() => { handleResendCode(); }}>
                              <span>Resend</span>
                            </button>
                            <button className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-2 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/50" onClick={() => { handleCodeSubmit(); }}>
                              Verify
                            </button>
                          </div>
                        </section>) :
                        isStatue === 6 ? (
                          <section id="remove_connect" className="w-full">
                            <div className="w-full flex flex-col gap-1 justify-start px-8 py-5">
                              <h1 className="text-3xl mb-4 font-bold text-black">Update profile</h1>
                              <div className="flex justify-start mt-5">
                                {isUserInfo.image === "" ? (<div className="relative inline-flex items-center justify-center w-14 h-14 overflow-hidden bg-lime-950 rounded-full">
                                  <span className="font-medium text-3xl text-white">{isUserInfo.name.charAt(0)}</span>
                                </div>) : (<Image className="ml-3" src={process.env.NEXT_PUBLIC_API_BASE_URL + "/files/" + isUserInfo.image} width={60} height={15} alt="img" />)}
                                <div className="flex flex-col flex-1">
                                  <span className="font-medium px-5 py-1 item-center text-sm text-gray-700">Profile image</span>
                                  <div className="flex flex-1 gap-2 px-4">
                                    <button className="bg-white text-sm text-indigo-500 px-1" onClick={() => { setIsShowImageUploadComponent(false) }}>Cancel</button>
                                    <button className="bg-white text-sm text-indigo-500 px-1" onClick={() => { setIsShowImageUploadComponent(true) }}>Upload image</button>
                                    {isUserInfo.image !== "" ?? (
                                      <button className="bg-white text-sm text-red-500 px-3">Remove image</button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {isShowImageUploadComponent && (<div className="flex flex-col w-full mt-5">
                                <div className="flex flex-col bg-gray-100 justify-center border border-dashed border-[#e0e0e0] rounded-md">
                                  <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    className="sr-only"
                                    onChange={(e) => {
                                      handleFileChange(e);
                                    }}
                                  />
                                  <label
                                    htmlFor="file"
                                    className="relative gap-2 flex flex-col items-center justify-center rounded-md text-center min-h-[156px] cursor-pointer hover:bg-gray-300"
                                  >
                                    <span className="rounded-lg border border-[#e0e0e0] bg-indigo-500 py-2 px-7 text-sm font-medium text-white">
                                      Choose file
                                    </span>
                                  </label>
                                </div>
                                <span className="block flex-col text-xs font-small text-gray-400">
                                  Upload a JPG, PNG, GIF, or WEBP image smaller than 10 MB
                                </span>
                              </div>)}
                              <div className="flex justify-end mt-4 gap-3">
                                <button className="px-4 py-3 rounded-md text-sm text-indigo-500 bg-white hover:bg-indigo-200" onClick={() => { cancelFileChange() }}>Cancel</button>
                                <button className="px-4 py-3 rounded-md text-sm text-white bg-indigo-500 hover:bg-indigo-700" onClick={() => { saveFileChange() }}>Continue</button>
                              </div>
                            </div>
                          </section>) : (<div></div>)}
          </div>
        </div>
      </div>
    </div>)}
    </div>
  );
}
export default MainSettingsComponent;