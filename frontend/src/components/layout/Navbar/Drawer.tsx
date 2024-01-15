import React, { ReactNode } from "react";

interface DrawerProps {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Drawer = ({ children, isOpen, setIsOpen }: DrawerProps) => {
  return (
    <main
      className={
        " fixed overflow-hidden z-20 bg-opacity-5 inset-0 transform ease-in-out" +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 translate-x-0  "
          : " transition-all delay-500 opacity-0 -translate-x-full  ")
      }
    >
      <section
        className={
          "w-[308px] max-w-sm left-0 bg-purple h-full shadow-xl round-lg delay-400 duration-500 ease-in-out transition-all transform" +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <article className="relative w-[308px] max-w-lg flex flex-col justify-between h-full bg-gray-100">
          <div>
            <header className="px-6 py-6 flex items-center justify-between">
              <div>
                <button
                  type="button"
                  className="w-[200px] px-4 py-2 justify-center text-indigo-400 bg-gray-100 hover:bg-gray-100 border border-gray-600 round-lg font-medium text-sm inline-flex items-center"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                    <path d="M16 5l3 3"></path>
                  </svg>
                  New Doc{" "}
                </button>
              </div>
              <div>
                <button
                  className="mantine-prepend-UnstyledButton-root mantine-prepend-ActionIcon-root mantine-prepend-k9xdt9"
                  type="button"
                  data-state="closed"
                  title={""}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <svg
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.25rem"
                    height="1.25rem"
                  >
                    <path
                      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </header>
            <div
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {children}
            </div>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Drawer;
