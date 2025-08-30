"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";
import { Combobox } from "../Tools/Combobox";

interface Initiale {
  name: string;
  adresse: string;
}
type Props = {
  loading: () => void;
};
type IInput = {
  placeholder: string;
  type: string;
  name: string;
};

function AddTiers({ loading }: Props) {
  const alltype = [
    { label: "Fournisseur", value: "fournisseur" },
    { label: "Client", value: "client" },
  ];
  const [type, setType] = React.useState<string>("");
  const [values, setValues] = React.useState<Initiale>({
    name: "",
    adresse: "",
  });
  const onchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const input: IInput[] = [
    { placeholder: "Nom", name: "name", type: "text" },
    { placeholder: "Adresse", name: "adresse", type: "text" },
  ];
  const sendData = async () => {
    try {
      const res = await fetch("/api/tiers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, type }),
      });
      const response = await res.json();
      if (response.status === 200) {
        setValues({
          name: "",
          adresse: "",
        });
        setType("");
        loading();
      } else {
        toast(JSON.stringify(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Label htmlFor="Type" className="mb-2">
        Type
      </Label>
      <Combobox value={type} setValue={setType} data={alltype} />

      {input.map((index, key) => {
        return (
          <div key={key} className="mt-3">
            <Label htmlFor={index.name} className="mb-2">
              {index.placeholder}
            </Label>
            <Input
              name={index.name}
              value={values[index.name as keyof Initiale]}
              onChange={(e) => onchange(e)}
              type={index.type}
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

export default AddTiers;
