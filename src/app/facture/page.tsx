"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Printer, Trash2 } from "lucide-react";
import moment from "moment";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import React from "react";
import Header from "../Header/Header";
import { IFacture } from "../Interfaces/IFacture";
import Loading from "../Tools/Loading";
import Popup from "../Tools/Popup";
import Tableau_set_Header from "../Tools/Tab_set_Header";
import Delete from "./Delete";

function Factures() {
  const [data, setData] = React.useState<IFacture[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const router = useRouter();
  const loadingFactures = async () => {
    try {
      const res = await fetch("/api/facture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.status === 200) {
        const donner: IFacture[] = response.data;
        const returnData = donner.map((index) => {
          return {
            ...index,
            dateSave: moment(index.dateSave).format("dddd DD-MM-YYYY"),
            status:
              index.prix_vente > index.payer ? "Non soldé" : "Facture soldé",
            prix_vente: index.prix_vente,
            payer: index.payer,
          };
        });
        setData(returnData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingFactures();
      setLoad(false);
    };
    initialize();
  }, []);

  const keyColonnes = [
    { title: "Num fact", accessorKey: "idFacture" },
    { title: "Client", accessorKey: "client" },
    { title: "Prix de vente", accessorKey: "prix_vente" },
    { title: "Payer", accessorKey: "payer" },
    { title: "Date d'enregistrement", accessorKey: "dateSave" },
    { title: "Effectué par", accessorKey: "doby" },
  ];

  const readFacture = (row: IFacture) => {
    router.push(`/onefacture/${row.idFacture}`);
  };

  const columns1: ColumnDef<IFacture>[] = keyColonnes.map((cle) => {
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
  const columns2: ColumnDef<IFacture>[] = [
    {
      accessorKey: "status_facture",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status_facture
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <>
          {row.original.status_facture ? (
            <p className={row.original.status_facture ? "encours" : "bloquer"}>
              {row.original.status_facture ? "Actif" : "Facture Supprimée"}
            </p>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <p
                  className={
                    row.original.status_facture ? "encours" : "bloquer"
                  }
                >
                  {row.original.status_facture ? "Actif" : "Facture Supprimée"}
                </p>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Motif de suppression</DialogTitle>
                <p>{row.original?.motif_suppression}</p>

                <p className="deleteby">
                  Supprimer par : {row.original.deletedby}
                </p>
                <p className="deleteddate">
                  {row.original?.date_deleted
                    ? moment(row.original?.date_deleted).format(
                        "dddd DD-MM-YYYY à HH:MM"
                      )
                    : ""}
                </p>
              </DialogContent>
            </Dialog>
          )}
        </>
      ),
    },
    {
      accessorKey: "statut_payement",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Statut payement
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <p
          className={
            row.original.status === "Non soldé" ? "nonsolder" : "solder"
          }
        >
          {row.original.status}
        </p>
      ),
    },
    {
      accessorKey: "Option",
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
          <Printer onClick={() => readFacture(row.original)} />
          {row.original.status_facture && (
            <Popup
              btnname={<Trash2 />}
              title="Suppression de la facture du client"
              component={
                <Delete
                  facture={row.original.idFacture}
                  setDonner={setData}
                  donner={data}
                />
              }
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <Header title="Factures">
      <main className="mx-auto max-w-[400mm] p-6 sm:p-10">
        {load ? (
          <Loading />
        ) : (
          <Tableau_set_Header
            data={data}
            columns={[...columns1, ...columns2]}
            customer_id="idFacture"
            search_placeholder="Filter by ID facture"
          />
        )}
      </main>
    </Header>
  );
}

export default Factures;
