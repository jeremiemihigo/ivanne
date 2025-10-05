"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Plus, Printer, Trash2 } from "lucide-react";
import moment from "moment";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import React from "react";
import Header from "../../Header/Header";
import { IReglement } from "../../Interfaces/ICaisse";
import Loading from "../../Tools/Loading";
import Popup from "../../Tools/Popup";
import Tableau_set_Header from "../../Tools/Tab_set_Header";
import AddReglement from "./AddReglement";
import Delete from "./Delete";

const dataFilter = [
  { label: "Num fact", value: "idFacture" },
  { label: "Client", value: "client" },
  { label: "Date d'enregistrement", value: "dateSave" },
  { label: "Effectué par", value: "saved_by" },
];

function Reglement() {
  const [data, setData] = React.useState<IReglement[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const router = useRouter();
  const loadingReglement = async () => {
    try {
      const res = await fetch("/api/caisse/reglement", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      console.log(response);
      if (response.status === 200) {
        const donner: IReglement[] = response.data;
        setData(donner);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingReglement();
      setLoad(false);
    };
    initialize();
  }, []);

  const keyColonnes = [
    { title: "Num fact", accessorKey: "idFacture" },
    { title: "Client", accessorKey: "client" },
    { title: "montant", accessorKey: "montant" },
    { title: "Date d'enregistrement", accessorKey: "dateSave" },
    { title: "Effectué par", accessorKey: "saved_by" },
  ];

  const readFacture = (row: IReglement) => {
    router.push(`/onefacture/${row.idFacture}`);
  };

  const columns1: ColumnDef<IReglement>[] = keyColonnes.map((cle) => {
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
  const columns2: ColumnDef<IReglement>[] = [
    {
      accessorKey: "status_reglement",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status_reglement
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <>
          {row.original.actif ? (
            <p className={row.original.actif ? "encours" : "bloquer"}>
              {row.original.actif ? "Actif" : "Règlement Supprimé"}
            </p>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <p className={row.original.actif ? "encours" : "bloquer"}>
                  {row.original.actif ? "Actif" : "Reglement Supprimé"}
                </p>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Motif de suppression</DialogTitle>
                <p>{row.original?.motif_deleted}</p>

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
          {row.original.actif && (
            <Popup
              btnname={<Trash2 />}
              title="Suppression du règlement"
              component={
                <Delete
                  donner={data}
                  setDonner={setData}
                  reglement={row.original.id}
                />
              }
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <Header title="Encaissements client">
      <main className="mx-auto max-w-[400mm] p-6 sm:p-10">
        {load ? (
          <Loading />
        ) : (
          <Tableau_set_Header
            data={data}
            columns={[...columns1, ...columns2]}
            customer_id="client"
            datafilter={dataFilter}
            childrenbtn={
              <Popup
                btnname={
                  <>
                    <Plus /> Ajoutez un règlement
                  </>
                }
                title="Ajoutez un règlement"
                component={<AddReglement data={data} setData={setData} />}
              />
            }
          />
        )}
      </main>
    </Header>
  );
}

export default Reglement;
