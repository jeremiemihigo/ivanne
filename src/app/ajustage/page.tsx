"use client";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import Header from "../Header/Header";
import { IAjustage } from "../Interfaces/IStock";
import Loading from "../Tools/Loading";

function PageAjustage() {
  const [data, setData] = React.useState<IAjustage[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const loadingData = async () => {
    const result = await fetch("/api/ajustage", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();

    if (result.status === 200) {
      setData(response.data);
      setLoad(false);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      loadingData();
    };
    initialize();
  }, []);

  const keyColonnes = [
    { title: "Produit", accessorKey: "Produit" },
    { title: "Ancienne_Qte", accessorKey: "Ancienne_Qte" },
    { title: "Nouvelle_Qte", accessorKey: "Nouvelle_Qte" },
    { title: "Date", accessorKey: "Date" },
    { title: "Motif", accessorKey: "Motif" },
    { title: "Par", accessorKey: "Par" },
  ];

  const columns1: ColumnDef<IAjustage>[] = keyColonnes.map((cle) => {
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
    <Header title="Modification stock">
      {load && <Loading />}
      {!load && (
        <div>
          <Tableau_set_Header
            data={data}
            columns={columns1}
            customer_id="Produit"
            search_placeholder="Filter by produit"
          />
        </div>
      )}
    </Header>
  );
}

export default PageAjustage;
