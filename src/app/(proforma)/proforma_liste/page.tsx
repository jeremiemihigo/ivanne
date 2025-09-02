"use client";
import Header from "@/app/Header/Header";
import { IProformaListe } from "@/app/Interfaces/IFacture";
import Loading from "@/app/Tools/Loading";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, View } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function Perte() {
  const router = useRouter();
  const [data, setData] = React.useState<IProformaListe[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const loadingData = async () => {
    const result = await fetch("/api/proforma", {
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
    { title: "idFacture", accessorKey: "idFacture" },
    { title: "Client", accessorKey: "client" },
    { title: "prix_vente", accessorKey: "prix_vente" },
    { title: "Nbre de produits", accessorKey: "produits" },
    { title: "Enregistré par", accessorKey: "doby" },
    { title: "Date d'enregistrement", accessorKey: "date" },
    { title: "Status", accessorKey: "considerer" },
  ];

  const columns1: ColumnDef<IProformaListe>[] = keyColonnes.map((cle) => {
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
  const columns2: ColumnDef<IProformaListe> = {
    accessorKey: "View",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Details
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <View
          onClick={() =>
            router.push(`/onefactureproforma/${row.original.idFacture}`)
          }
        />
      </div>
    ),
  };

  return (
    <Header title="Factures proforma">
      {load && <Loading />}

      {!load && (
        <div className="overflow-auto">
          <Tableau_set_Header
            data={data}
            columns={[...columns1, columns2]}
            customer_id="client"
            search_placeholder="Filter by client"
            childrenbtn={
              <Button onClick={() => router.push("/addproforma")}>
                Ajoutez une facture preforma
              </Button>
            }
          />
        </div>
      )}
    </Header>
  );
}

export default Perte;
