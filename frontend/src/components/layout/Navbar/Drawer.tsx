import React, { ReactNode } from "react";
import Image from "next/image";
import axios from "axios";

import { setDuckBookListState } from "@/redux/features/navbarlist-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import CloseDialogIcon from "@/assets/images/icons/CloseDialog.svg";

interface DrawerProps {
  id: string;
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Drawer = ({ id, children, isOpen, setIsOpen }: DrawerProps) => {
  const dispatch = useAppDispatch();

  const changeTableData = (response: any) => {
    let response_data = response;
    let final_data: any = [];
    response_data.map((item: any, index: number) => {
      let temp_data = {
        ID: 0,
        USER_ID: "",
        DB_NAME: "",
        STATUE: 0,
        DATA: "",
      };
      temp_data["ID"] = item[0];
      temp_data["USER_ID"] = String(item[1]);
      temp_data["DB_NAME"] = String(item[2]);
      temp_data["STATUE"] = item[3];
      temp_data["DATA"] = String(item[4]);

      final_data.push(temp_data);
    });
    dispatch(setDuckBookListState(final_data));
  };

  return (
    <main
      className={
        "fixed z-20 bg-opacity-50 bg-gray-300 inset-0 transform ease-in-out " +
        (isOpen
          ? "transition-opacity opacity-100 duration-500 translate-x-0"
          : "transition-all delay-500 opacity-0 -translate-x-full")
      }
    >
      <section
        className={
          "w-[308px] max-w-sm left-0 bg-purple h-full shadow-xl round-lg delay-400 duration-500 ease-in-out transition-all transform " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <article className="relative w-[308px] max-w-lg flex flex-col justify-between h-full bg-gray-100">
          <header className="px-6 py-6 flex items-center justify-end">
            <div>
              <button
                type="button"
                data-state="closed"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <Image src={CloseDialogIcon} alt="" width="20" height="20" />
              </button>
            </div>
          </header>
          {children}
        </article>
      </section>
    </main>
  );
};

export default Drawer;
