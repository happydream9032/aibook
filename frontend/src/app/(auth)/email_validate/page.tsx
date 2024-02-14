"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Email_Validate = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [isStartTimer, setIsStartTimer] = useState(true)
  const [isTime, setIsTime] = useState(60);

  useEffect(() => {
    handleSetTime();
  }, []);

  const handleCodeSubmit = async () => {
    try {
      let temp: any = localStorage.getItem("user_authenticate");
      let user = JSON.parse(temp);
      let data = {
        EMAIL: user["email"],
        TOKEN: user["token"]
      }
      let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/verify";
      await axios
        .post(update_apiUrl, data)
        .then((response) => {
          console.log("update response is", response.data);
          if (response.data.code === 200) {
            toast.success("User Registered!", { position: "top-right" });
            router.push("/sign-in")
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
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendCode = async () => {
    try {
      let temp: any = localStorage.getItem("user_authenticate")
      let user = JSON.parse(temp);
      let data = {
        EMAIL: user["email"],
        TYPE: 1
      }
      let update_apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/resetOTPcode";
      await axios
        .post(update_apiUrl, data)
        .then((response) => {
          console.log("update response is", response.data);
          if (response.data.code === 200) {
            let json_data = {
              email: user["email"],
              token: response.data.data
            }
            localStorage.setItem("user_authenticate", JSON.stringify(json_data));
            toast.success("Resend otp code!", { position: "top-right" });
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

  const handleSetTime = () => {
    let time = 60
    setInterval(() => {
      setIsTime(isTime - 1);
      if (isTime === 0) {
        setIsStartTimer(false);
      }
    }, 1000);
  }
  return (
    <div className="__className_0ec1f4 bg-white" style={{ height: "100vh" }}>
      <ToastContainer />
      <div className="mantine-prepend-Center-root pt-20 mantine-prepend-ojrz4j flex items-center justify-center">
        <div className="w-full items-center justify-center bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-2 space-y-4 md:space-y-6 sm:p-8">
            <div className="mb-3 flex w-full items-center justify-center">
              <Image
                src="/images/logo-64x64.png"
                alt="logo"
                width={64}
                height={64}
                className="align-center w-auto"
              />
            </div>
            <span className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Verify your email
              <br />
            </span>
            <span className="text-base font-bold text-gray-400 md:text-lg ">
              to continue to DataBook
            </span>
            <div className="flex flex-col">
              <span className="flex justify-start block mb-2 text-sm font-medium text-gray-900"> Verification code </span>
              <span className="flex justify-start block mb-2 text-sm font-medium text-gray-500"> Enter the verification code sent to your email address </span>
            </div>
            <div className="flex flex-col gap-6">
              <input
                type="text"
                name="otp_number"
                id="otp_number"
                placeholder="6-number of One Time Password(OTP)"
                className="text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
                required={true}
                value={code}
                onChange={(e) => { setCode(e.currentTarget.value) }}
              />
            </div>
            <button className="flex w-full items-center justify-center rounded-md bg-white border-2 border-indigo-600 px-5 py-2 text-base font-medium text-gray-700 shadow-submit duration-300 hover:bg-gray-400" onClick={() => { handleResendCode(); }}>
              <span>Resend <span>{isStartTimer === false ? "" : "(" + isTime + ")"}</span></span>
            </button>
            <button className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-2 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/50" onClick={() => { handleCodeSubmit(); }}>
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Email_Validate;