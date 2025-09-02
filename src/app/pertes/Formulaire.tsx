"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { IPerte } from "../Interfaces/IOther";
import { IProduit } from "../Interfaces/Produit";
import { Combobox } from "../Tools/Combobox";
import Loading from "../Tools/Loading";

interface Initiale {
  motif: string;
  quantite: string;
}
type Props = {
  data: IPerte[];
  setData: React.Dispatch<React.SetStateAction<IPerte[]>>;
};
function Formulaire({ data, setData }: Props) {
  //idProduit, motif, quantite
  const [produits, setProduits] = React.useState<IProduit[]>([]);
  const [produit, setProduit] = React.useState<string>("");
  const [load, setLoad] = React.useState<boolean>(true);
  const [initiale, setInitiale] = React.useState<Initiale>({
    motif: "",
    quantite: "",
  });
  const loadingData = async () => {
    const result = await fetch("/api/produit", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      setProduits(response.data);
      setLoad(false);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      loadingData();
    };
    initialize();
  }, []);
  const sendData = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/perte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...initiale, idProduit: produit }),
      });
      const result = await res.json();
      if (result.status === 200) {
        setData([result.data, ...data]);
        toast("Perte enregistrée avec succès", { duration: 10000 });
        setInitiale({
          motif: "",
          quantite: "",
        });
        setProduit("");
      } else {
        toast(JSON.stringify(result.message), { duration: 10000 });
      }
    } catch (error) {
      toast(JSON.stringify(error));
    }
  };
  return (
    <div>
      {load ? (
        <Loading />
      ) : (
        <>
          <div>
            <Label className="mb-3">Selectionnez le produit</Label>
            <Combobox
              data={produits.map((x) => {
                return {
                  value: x.idProduit,
                  label: x.produit,
                };
              })}
              setValue={setProduit}
              value={produit}
            />
          </div>
          <div className="mt-3">
            <Label className="mb-3">Motif</Label>
            <Input
              value={initiale.motif}
              placeholder="Motif"
              onChange={(e) => {
                setInitiale({
                  ...initiale,
                  motif: e.target.value,
                });
              }}
            />
          </div>
          <div className="mt-3">
            <Label className="mb-3">Quantité</Label>
            <Input
              type="number"
              placeholder="Quantité"
              value={initiale.quantite}
              onChange={(e) => {
                setInitiale({
                  ...initiale,
                  quantite: e.target.value,
                });
              }}
            />
          </div>
          <div className="mt-2">
            <Button className="w-full" onClick={(e) => sendData(e)}>
              <Plus /> Valider
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Formulaire;
