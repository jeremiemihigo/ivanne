"use client";
import Header from "@/app/Header/Header";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";

interface OneFactureProps {
  params: Promise<{
    id: string;
  }>;
}

interface IDetailCaisse {
  idCaisse: string;
  initiale_usd: number;
  initiale_cdf: number;
  commentaire_ouverture: string;
  dateSave: number;
  ouvert_par: string;
  cash_usd: number;
  cash_cdf: number;
  cash_virtuelle: number;
}

function Detail_Caisse({ params }: OneFactureProps) {
  const { id } = React.use(params);
  const [data, setData] = React.useState<IDetailCaisse[]>([]);
  const loadingDetails = async () => {
    try {
      const res = await fetch(`/api/caisse/detailcaisse/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingDetails();
    };
    initialize();
  }, [id]);
  const keyColonnes = [
    { title: "ID", accessorKey: "idCaisse" },
    { title: "Initiale USD", accessorKey: "initiale_usd" },
    { title: "Initiale CDF", accessorKey: "initiale_cdf" },
    { title: "dateSave", accessorKey: "dateSave" },
    { title: "ouvert_par", accessorKey: "ouvert_par" },
    { title: "cash_usd", accessorKey: "cash_usd" },
    { title: "cash_cdf", accessorKey: "cash_cdf" },
    { title: "cash_virtuelle", accessorKey: "cash_virtuelle" },
  ];

  const columns1: ColumnDef<IDetailCaisse>[] = keyColonnes.map((cle) => {
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
    <Header title="Détails de la caisse">
      <Tableau_set_Header
        data={data}
        columns={columns1}
        customer_id="dateSave"
        search_placeholder="Filtrer par date"
      />
    </Header>
  );
}

export default Detail_Caisse;
