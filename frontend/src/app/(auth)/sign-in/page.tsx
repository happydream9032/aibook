"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
const SignIn = () => {
  const router = useRouter();

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
              Sign in
              <br />
            </span>
            <span className="text-base font-bold text-gray-400 md:text-lg ">
              to continue to Duckbook
            </span>
            <button className="mb-10 flex w-full items-left justify-left rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-2 text-base text-black outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary">
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
                  className="text-md block px-3 py-2 rounded-lg w-full bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500 focus:bg-white focus:border-gray-600 focus:outline-none"
                  required={true}
                />
              </div>
              <button className="flex w-full items-center justify-center rounded-md bg-primary px-5 py-2 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/50">
                CONTINUE
              </button>
              <div className="mx-auto max-w-7xl py-8 md:flex md:items-center md:justify-between">
                <div className="mantine-Group-root gap-4 font-medium mantine-k3ov3c">
                  <p className="text-sm font-light text-gray-600">
                    No Account?{" "}
                    <a
                      href="/sign-up"
                      className="font-medium text-indigo-500 hover:underline"
                    >
                      Sign up
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

export default SignIn;
