"use client";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2 } from "lucide-react";
import React from "react";
import AddAjustage from "../ajustage/AddAjustage";
import Header from "../Header/Header";
import { IStock } from "../Interfaces/IStock";
import Loading from "../Tools/Loading";
import Popup from "../Tools/Popup";

function PageStock() {
  const [data, setData] = React.useState<IStock[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const loadingData = async () => {
    const result = await fetch("/api/stock", {
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
    { title: "Produit", accessorKey: "produit" },
    { title: "Unite", accessorKey: "unite" },
    { title: "Prix d'achat", accessorKey: "prix_achat" },
    { title: "Prix de vente", accessorKey: "prix_vente" },
    { title: "Quantite", accessorKey: "quantite" },
  ];

  const columns1: ColumnDef<IStock>[] = keyColonnes.map((cle) => {
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
  const options: ColumnDef<IStock>[] = [
    {
      id: "Option",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Edit
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Popup
          btnname={<Edit2 />}
          title={`Modification stock ${row.original.produit} `}
          component={
            <AddAjustage
              stock={row.original}
              setDonner={setData}
              donner={data}
            />
          }
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <Header title="Stock">
      {load && <Loading />}
      {!load && (
        <div className="overflow-auto">
          <Tableau_set_Header
            data={data}
            columns={[...columns1, ...options]}
            customer_id="produit"
            search_placeholder="Filter by produit"
          />
        </div>
      )}
    </Header>
  );
}

export default PageStock;
