"use client";
import { ModeToggle } from "@/components/mode-toogle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import { IUser } from "../Interfaces/IUser";
import ChangePassword from "./ChangePassword";

type Props = {
  children: ReactNode;
  title: string;
};

function Header({ children, title }: Props) {
  const [user, setUser] = React.useState<IUser>();

  React.useEffect(() => {
    const loadingUser = async () => {
      try {
        const result = await fetch("/api/login", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await result.json();
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const initialize = async () => {
      await loadingUser();
    };
    initialize();
  }, []);
  return (
    <>
      <div className="bg-[#00A651] w-full p-4 flex items-center justify-between shadow-md header_">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <ModeToggle />
        </div>
        <div className="ml-5 lg:text-2xl">
          <p className="text-white font-bold">{title}</p>
        </div>
        {user && !user?.connect && <ChangePassword />}
        <div className="flex-1 text-right">
          <h1 className="hidden md:block text-white font-bold text-sm md:text-2xl lg:text-1xl xl:text-1xl m-0"></h1>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </>
  );
}

export default Header;
