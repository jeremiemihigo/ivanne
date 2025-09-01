"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import Header from "../Header/Header";
import { IApprovisionnement } from "../Interfaces/IApprovisionnement";
import Loading from "../Tools/Loading";
import Popup from "../Tools/Popup";
import Tableau_set_Header from "../Tools/Tab_set_Header";
import Approvisionnement from "./Approvisionnement";

function Stock() {
  const [load, setLoad] = React.useState<boolean>(true);
  const [data, setData] = React.useState<IApprovisionnement[]>([]);
  const loadingData = async () => {
    const result = await fetch("/api/approvisionnement", {
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
    { title: "Num_lot", accessorKey: "num_lot" },
    { title: "unite", accessorKey: "unite" },
    { title: "Réf", accessorKey: "reference" },
    { title: "Ancienn Qté", accessorKey: "ancien_qte" },
    { title: "Qte", accessorKey: "quantite" },
    { title: "P.A.U", accessorKey: "prix_achat" },
    { title: "P.V.U", accessorKey: "prix_vente" },
    { title: "Fournisseur", accessorKey: "fournisseur" },
    { title: "Date d'enregistrement", accessorKey: "dateSave" },
    { title: "Enregistré par", accessorKey: "doby" },
  ];

  const columns1: ColumnDef<IApprovisionnement>[] = keyColonnes.map((cle) => {
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
    <Header title="Approvisionnement">
      {load ? (
        <Loading />
      ) : (
        <>
          <div>
            <Tableau_set_Header
              data={data}
              columns={columns1}
              customer_id="produit"
              search_placeholder="Filter by produit"
              childrenbtn={
                <Popup
                  title="Approvisionnement"
                  component={
                    <Approvisionnement donner={data} setDonner={setData} />
                  }
                  btnname="Approvisionnement"
                />
              }
            />
          </div>
        </>
      )}
    </Header>
  );
}

export default Stock;
