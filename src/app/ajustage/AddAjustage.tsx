"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";
import { IStock } from "../Interfaces/IStock";

interface Initiale {
  nouveau_qte: number;
  motif: string;
}
type Props = {
  stock: IStock;
  donner: IStock[];
  setDonner: React.Dispatch<React.SetStateAction<IStock[]>>;
};

function AddAjustage({ stock, setDonner, donner }: Props) {
  const [values, setValues] = React.useState<Initiale>({
    nouveau_qte: 0,
    motif: "",
  });

  const onchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const input = [
    {
      placeholder: "Nouvelle quantité",
      name: "nouveau_qte",
      type: "number",
    },
    {
      placeholder: "Motif",
      name: "motif",
      type: "text",
    },
  ];

  const sendData = async () => {
    try {
      const donners = {
        idProduit: stock.idProduit,
        nouveau_qte: values.nouveau_qte,
        motif: values.motif,
      };
      const res = await fetch("/api/ajustage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donners),
      });
      const response = await res.json();
      if (response.status === 200) {
        setDonner(
          donner.map((x) =>
            x.idProduit === response.data.idProduit ? response.data : x
          )
        );
        setValues({
          motif: "",
          nouveau_qte: 0,
        });
      } else {
        toast(JSON.stringify(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {input.map((index, key) => {
        return (
          <div key={key} className="mt-3">
            <Label htmlFor={index.name} className="mb-2">
              {index.placeholder}
            </Label>
            <Input
              name={index.name}
              onChange={(e) => onchange(e)}
              type={index.type}
              value={values[index.name as keyof Initiale]}
            />
          </div>
        );
      })}
      <Button onClick={() => sendData()} className="w-full mt-3">
        Valider
      </Button>
    </>
  );
}

export default AddAjustage;
