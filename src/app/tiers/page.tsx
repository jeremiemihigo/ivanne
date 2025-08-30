"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import Header from "../Header/Header";
import { ITiers } from "../Interfaces/ITiers";
import Loading from "../Tools/Loading";
import Popup from "../Tools/Popup";
import Tableau_set_Header from "../Tools/Tab_set_Header";
import AddTiers from "./AddTiers";

function Tiers() {
  const [load, setLoad] = React.useState<boolean>(true);
  const [data, setData] = React.useState<ITiers[]>([]);
  const loadingData = async () => {
    const result = await fetch("/api/tiers/all", {
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
    { title: "Nom", accessorKey: "name" },
    { title: "Adresse", accessorKey: "adresse" },
    { title: "doby", accessorKey: "doby" },
    { title: "type", accessorKey: "type" },
  ];

  const columns1: ColumnDef<ITiers>[] = keyColonnes.map((cle) => {
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
    <Header title="Stock">
      {load ? (
        <Loading />
      ) : (
        <>
          <Popup
            title="Ajoutez un client ou un fournisseur"
            component={<AddTiers loading={loadingData} />}
            btnname="Client/Fournisseur"
          />
          <div>
            <Tableau_set_Header
              data={data}
              columns={columns1}
              customer_id="name"
              search_placeholder="Filter by name"
            />
          </div>
        </>
      )}
    </Header>
  );
}

export default Tiers;
