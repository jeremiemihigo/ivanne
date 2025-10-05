"use client";
import { IUser } from "@/app/Interfaces/IUser";
import Loading from "@/app/Tools/Loading";
import Popup from "@/app/Tools/Popup";
import Tableau_set_Header from "@/app/Tools/Tab_set_Header";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Formulaire from "./Formulaire";

function Utilisateurs() {
  const router = useRouter();
  const [data, setData] = React.useState<IUser[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const loadingData = async () => {
    const result = await fetch("/api/utilisateur", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();

    if (result.status === 200) {
      setData(response.data);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingData();
      setLoad(false);
    };
    initialize();
  }, []);

  const keyColonnes = [
    { title: "username", accessorKey: "username" },
    { title: "Name", accessorKey: "name" },
    { title: "Fonction", accessorKey: "fonction" },
    { title: "Actif", accessorKey: "actif" },
  ];

  const columns1: ColumnDef<IUser>[] = keyColonnes.map((cle) => {
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
  const columns2: ColumnDef<IUser>[] = [
    {
      accessorKey: "Options",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Options
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Button onClick={() => router.push(`/permissions/${row.original.id}`)}>
          Permissions
        </Button>
      ),
    },
  ];
  return (
    <div>
      {load ? (
        <Loading />
      ) : (
        <>
          <div>
            <Tableau_set_Header
              data={data}
              columns={[...columns1, ...columns2]}
              customer_id="username"
              childrenbtn={
                <Popup
                  title="Ajoutez un nouveau utilisateur"
                  component={<Formulaire data={data} setData={setData} />}
                  btnname="Ajoutez un nouveau utilisateur"
                />
              }
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Utilisateurs;
