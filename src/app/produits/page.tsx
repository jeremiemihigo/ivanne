"use client";
import Popup from "@/app/Tools/Popup";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit2 } from "lucide-react";
import React from "react";
import Header from "../Header/Header";
import { IProduit } from "../Interfaces/Produit";
import Loading from "../Tools/Loading";
import AddProduit from "./AddProduit";

function PageProduit() {
  const [data, setData] = React.useState<IProduit[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const loadingData = async () => {
    const result = await fetch("/api/produit", {
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
    { title: "ID", accessorKey: "idProduit" },
    { title: "Unite", accessorKey: "unite" },
    { title: "Designation", accessorKey: "produit" },
    { title: "Prix d'achat", accessorKey: "prix_achat" },
    { title: "Prix de vente", accessorKey: "prix_vente" },
    { title: "Quantite d'alerte", accessorKey: "alerte" },
  ];

  const columns1: ColumnDef<IProduit>[] = keyColonnes.map((cle) => {
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

  const options: ColumnDef<IProduit>[] = [
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
          title="Modification"
          component={
            <AddProduit
              produit={row.original}
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
    <Header title="Produits">
      {load && <Loading />}
      {!load && (
        <div>
          <Tableau_set_Header
            data={data}
            columns={[...columns1, ...options]}
            customer_id="produit"
            search_placeholder="Filter by produit"
            childrenbtn={
              <Popup
                title="Ajoutez un nouveau produit"
                component={<AddProduit donner={data} setDonner={setData} />}
                btnname="Ajoutez un nouveau produit"
              />
            }
          />
        </div>
      )}
    </Header>
  );
}

export default PageProduit;
