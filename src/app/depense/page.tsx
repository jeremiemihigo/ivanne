"use client";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Delete } from "lucide-react";
import React from "react";
import Header from "../Header/Header";
import { IDepense } from "../Interfaces/IOther";
import Loading from "../Tools/Loading";
import Popup from "../Tools/Popup";
import DeleteDepense from "./DeleteDepense";
import Formulaire from "./Formulaire";

function PageStock() {
  const [data, setData] = React.useState<IDepense[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const loadingData = async () => {
    const result = await fetch("/api/depense", {
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
    { title: "Coût", accessorKey: "montant" },
    { title: "Enregistré par", accessorKey: "doby" },
    { title: "Date d'enregistrement", accessorKey: "dateSave" },
  ];

  const columns1: ColumnDef<IDepense>[] = keyColonnes.map((cle) => {
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
  const options: ColumnDef<IDepense>[] = [
    {
      id: "Status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <p className={row.original.actif ? "encours" : "bloquer"}>
              {row.original.actif ? "Actif" : "Dépense Supprimée"}
            </p>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Motif de suppression</DialogTitle>
            {row.original?.deleted_by ? (
              <div>
                <p>{row.original?.motif_delete}</p>
                <p style={{ textAlign: "right", fontSize: "11px" }}>
                  Supprimée par : {row.original?.deleted_by}
                </p>
              </div>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "15px",
                  color: "green",
                }}
              >
                Actif
              </p>
            )}
          </DialogContent>
        </Dialog>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "Option",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Supprimer
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Popup
          btnname={<Delete />}
          title={`Suppression`}
          component={
            <DeleteDepense
              setData={setData}
              data={data}
              id={row.original._id}
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
            customer_id="motif"
            search_placeholder="Filter by Motif"
            childrenbtn={
              <Popup
                btnname="Ajoutez une dépense"
                title="Ajoutez une dépense"
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
