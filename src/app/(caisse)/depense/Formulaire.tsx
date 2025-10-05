"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import { IDepense } from "../../Interfaces/IOther";

interface Initiale {
  motif: string;
  montant: string;
}
type Props = {
  data: IDepense[];
  setData: React.Dispatch<React.SetStateAction<IDepense[]>>;
};
function Formulaire({ data, setData }: Props) {
  const [initiale, setInitiale] = React.useState<Initiale>({
    motif: "",
    montant: "",
  });
  const sendData = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/depense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initiale),
      });
      const result = await res.json();
      if (result.status === 200) {
        setData([result.data, ...data]);
        toast("Dépense enregistrée avec succès", { duration: 10000 });
        setInitiale({
          motif: "",
          montant: "",
        });
      } else {
        toast(JSON.stringify(result.message), { duration: 10000 });
      }
    } catch (error) {
      toast(JSON.stringify(error), { duration: 10000 });
    }
  };
  return (
    <div>
      {/* motif, montant */}
      <div>
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
        <Input
          type="number"
          placeholder="Montant"
          value={initiale.montant}
          onChange={(e) => {
            setInitiale({
              ...initiale,
              montant: e.target.value,
            });
          }}
        />
      </div>
      <div className="mt-2">
        <Button className="w-full" onClick={(e) => sendData(e)}>
          Valider
        </Button>
      </div>
    </div>
  );
}

export default Formulaire;
