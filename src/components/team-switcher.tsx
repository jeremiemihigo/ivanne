"use client";

import { ChevronsUpDown } from "lucide-react";

import { IShop } from "@/app/Interfaces/Shop";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

export function TeamSwitcher() {
  const [data, setData] = React.useState<IShop | null>(null);

  const loadingData = async () => {
    try {
      const res = await fetch("/api/configuration", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (result.status === 200) {
        setData(result.data);
      } else {
        toast(JSON.stringify(result.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingData();
    };
    initialize();
  }, []);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {data && data.filename && (
                <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src={data.filename}
                    alt="iconimage"
                    width={50}
                    height={50}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {data && data.shop}
                </span>
                <span className="truncate text-xs">Pharmacy</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
