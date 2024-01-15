"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
const SignUp = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
  }, []);

  return (
    <div className="__className_0ec1f4 bg-white" style={{ height: "100vh" }}>
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
              Create your account
              <br />
            </span>
            <span className="text-base font-bold text-gray-400 md:text-lg mb-10">
              to continue to Duckbook
            </span>
            <button className="mb-6 flex w-full items-left justify-left rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-2 text-base text-black outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary">
              <span className="mr-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_95:967)">
                    <path
                      d="M20.0001 10.2216C20.0122 9.53416 19.9397 8.84776 19.7844 8.17725H10.2042V11.8883H15.8277C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2946 14.7577 13.7416 15.1327L13.722 15.257L16.7512 17.5567L16.961 17.5772C18.8883 15.8328 19.9997 13.266 19.9997 10.2216"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.2042 20.0001C12.9592 20.0001 15.2721 19.1111 16.9616 17.5778L13.7416 15.1332C12.88 15.7223 11.7235 16.1334 10.2042 16.1334C8.91385 16.126 7.65863 15.7206 6.61663 14.9747C5.57464 14.2287 4.79879 13.1802 4.39915 11.9778L4.27957 11.9878L1.12973 14.3766L1.08856 14.4888C1.93689 16.1457 3.23879 17.5387 4.84869 18.512C6.45859 19.4852 8.31301 20.0005 10.2046 20.0001"
                      fill="#34A853"
                    />
                    <path
                      d="M4.39911 11.9777C4.17592 11.3411 4.06075 10.673 4.05819 9.99996C4.0623 9.32799 4.17322 8.66075 4.38696 8.02225L4.38127 7.88968L1.19282 5.4624L1.08852 5.51101C0.372885 6.90343 0.00012207 8.4408 0.00012207 9.99987C0.00012207 11.5589 0.372885 13.0963 1.08852 14.4887L4.39911 11.9777Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1826 0.901848 12.7366 -0.0298855 10.2042 -3.6784e-05C8.3126 -0.000477834 6.45819 0.514732 4.8483 1.48798C3.2384 2.46124 1.93649 3.85416 1.08813 5.51101L4.38775 8.02225C4.79132 6.82005 5.56974 5.77231 6.61327 5.02675C7.6568 4.28118 8.91279 3.87541 10.2042 3.86663Z"
                      fill="#EB4335"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_95:967">
                      <rect width="20" height="20" fill="black" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
            <form className="space-y-4 md:space-y-6" action="#">
              <div className="mb-10 flex items-center justify-center">
                <span className="h-[1px] w-full max-w-[250px] bg-gray-600 sm:block"></span>
                <p className="w-auto px-5 text-center text-sm font-medium text-gray-600">
                  or
                </p>
                <span className="h-[1px] w-full max-w-[250px] bg-gray-600 sm:block"></span>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder=" "
                  className="text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
                  required={true}
                />
              </div>
              <div>
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Password
                  </label>
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder={""}
                    required={true}
                    className="text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <svg
                      className="mt-6 h-6 text-gray-700"
                      fill="none"
                      onClick={() => setShow(!show)}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      {show ? (
                        <path
                          fill="currentColor"
                          d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                        ></path>
                      ) : (
                        <path
                          fill="currentColor"
                          d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                        ></path>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
              <button className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-2 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/50">
                CONTINUE
              </button>
              <div className="mx-auto max-w-7xl py-8 md:flex md:items-center md:justify-between">
                <div className="mantine-Group-root gap-4 font-medium mantine-k3ov3c">
                  <p className="text-sm font-light text-gray-600">
                    Have an account?{" "}
                    <a
                      href="/sign-in"
                      className="font-medium text-indigo-500 hover:underline"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-5 md:mt-0">
                  <a
                    href="https://www.duckbook.ai/privacy"
                    className="text-sm font-medium text-gray-700 hover:underline"
                  >
                    Privacy
                  </a>
                  <a
                    href="https://www.duckbook.ai/terms"
                    className="text-sm font-medium text-gray-700 hover:underline"
                  >
                    Terms
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
