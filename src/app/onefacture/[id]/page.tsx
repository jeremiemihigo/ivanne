"use client";
import Header from "@/app/Header/Header";
import { IFacture } from "@/app/Interfaces/IFacture";
import { IShop } from "@/app/Interfaces/Shop";
import Loading from "@/app/Tools/Loading";
import React from "react";
import { toast } from "sonner";
import Facture from "./Facture";

interface OneFactureProps {
  params: Promise<{
    id: string;
  }>;
}

function OneFacture({ params }: OneFactureProps) {
  const { id } = React.use(params);
  const [data, setData] = React.useState<IFacture[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const [shop, setShop] = React.useState<IShop>();
  console.log(shop);

  React.useEffect(() => {
    const loadingData = async () => {
      try {
        if (id) {
          const res = await fetch(`/api/facture/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const response = await res.json();
          if (response.status === 200) {
            setData(response.data.facture);
            setShop(response.data.shop);
            setLoad(false);
          } else {
            toast(JSON.stringify(response.data));
            setLoad(false);
          }
        }
      } catch (error) {
        console.log(error);
        setLoad(false);
      }
    };

    const initialize = async () => {
      await loadingData();
    };
    initialize();
  }, [id]);

  return (
    <Header
      title={
        data.length === 0
          ? "Chargement..."
          : `Facture du client ${data[0]?.client}`
      }
    >
      {load && <Loading />}
      {!load && data.length > 0 && shop && <Facture data={data} shop={shop} />}
    </Header>
  );
}

export default OneFacture;
