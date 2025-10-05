"use client";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import Header from "../../Header/Header";
import { IEntrer } from "../../Interfaces/IOther";
import Loading from "../../Tools/Loading";
import Popup from "../../Tools/Popup";
import Formulaire from "./Formulaire";

const dataFilter = [
  { label: "Motif", value: "motif" },
  { label: "Provenance", value: "provenance" },
  { label: "Montant", value: "montant" },
  { label: "Caisse", value: "caisse" },
  { label: "Enregistré par", value: "saved_by" },
  { label: "Date d'enregistrement", value: "dateSave" },
];

function PageStock() {
  const [data, setData] = React.useState<IEntrer[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const loadingData = async () => {
    const result = await fetch("/api/entrer", {
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
    { title: "Motif", accessorKey: "motif" },
    { title: "Provenance", accessorKey: "provenance" },
    { title: "Montant", accessorKey: "montant" },
    { title: "Caisse", accessorKey: "caisse" },
    { title: "Enregistré par", accessorKey: "saved_by" },
    { title: "Date d'enregistrement", accessorKey: "dateSave" },
  ];

  const columns1: ColumnDef<IEntrer>[] = keyColonnes.map((cle) => {
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
    <Header title="Autres Encaissements">
      {load && <Loading />}

      {!load && (
        <div className="overflow-auto">
          <Tableau_set_Header
            data={data}
            columns={columns1}
            customer_id="motif"
            datafilter={dataFilter}
            childrenbtn={
              <Popup
                btnname="Ajoutez un encaissement"
                title="Ajoutez un encaissement"
                component={<Formulaire setData={setData} data={data} />}
              />
            }
          />
        </div>
      )}
    </Header>
  );
}

export default PageStock;
