"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Printer } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React from "react";
import Header from "../Header/Header";
import { IventePerte } from "../Interfaces/Produit";
import Loading from "../Tools/Loading";
import Tableau_set_Header from "../Tools/Tab_set_Header";

const dataFilter = [
  { label: "Produit", value: "produit" },
  { label: "Prix_vente", value: "prix_vente" },
  { label: "Montant", value: "montant" },
  { label: "Facture", value: "facture" },
  { label: "Client", value: "client" },
  { label: "Effectué par", value: "saveby" },
];

function VentePerte() {
  const [data, setData] = React.useState<IventePerte[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const loading = async () => {
    try {
      const result = await fetch("/api/vente", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await result.json();
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loading();
      setLoad(false);
    };
    initialize();
  }, []);
  const router = useRouter();
  const readFacture = (row: string) => {
    router.push(`/onefacture/${row}`);
  };

  const keyColonnes = [
    { title: "Produit", accessorKey: "produit" },
    { title: "Prix_vente", accessorKey: "prix_vente" },
    { title: "Montant perçu", accessorKey: "montant" },
    { title: "Perte", accessorKey: "perte" },
    { title: "Facture", accessorKey: "facture" },
    { title: "Client", accessorKey: "client" },
    { title: "Effectué par", accessorKey: "saveby" },
  ];
  const columns2: ColumnDef<IventePerte>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => moment(row.original.dateSave).format("DD-MM-YYYY"),
    },
    {
      accessorKey: "option",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Option
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Printer onClick={() => readFacture(row.original.facture)} />
        </div>
      ),
    },
  ];
  return (
    <Header title="Produit vendu à perte">
      {data.length > 0 && (
        <>
          {load ? (
            <Loading />
          ) : (
            <Tableau_set_Header
              data={data}
              columns={[...keyColonnes, ...columns2]}
              customer_id="produit"
              datafilter={dataFilter}
            />
          )}
        </>
      )}
    </Header>
  );
}

export default VentePerte;
