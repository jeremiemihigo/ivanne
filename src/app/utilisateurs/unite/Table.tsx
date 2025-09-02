"use client";
import { IUnite } from "@/app/Interfaces/IOther";
import Popup from "@/app/Tools/Popup";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import AddUnite from "./AddUnite";

function TableUnite() {
  const [data, setData] = React.useState<IUnite[]>([]);
  const loadingData = async () => {
    const result = await fetch("/api/unite", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();

    if (result.status === 200) {
      setData(response.data);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      loadingData();
    };
    initialize();
  }, []);

  const keyColonnes = [
    { title: "unite", accessorKey: "unite" },
    { title: "idUnite", accessorKey: "idUnite" },
  ];

  const columns1: ColumnDef<IUnite>[] = keyColonnes.map((cle) => {
    return {
      accessorKey: cle.accessorKey,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {cle.title}
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue(cle.accessorKey)}</div>,
    };
  });

  return (
    <div>
      <div>
        <Tableau_set_Header
          data={data}
          columns={columns1}
          customer_id="unite"
          search_placeholder="Filter by unite"
          childrenbtn={
            <Popup
              title="Ajoutez une nouvelle unité"
              component={<AddUnite />}
              btnname="Ajoutez une nouvelle unité"
            />
          }
        />
      </div>
    </div>
  );
}

export default TableUnite;
