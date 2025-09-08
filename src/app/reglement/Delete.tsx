"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";
import { IReglement } from "../Interfaces/ICaisse";

type Props = {
  donner: IReglement[];
  setDonner: React.Dispatch<React.SetStateAction<IReglement[]>>;
  reglement: string;
};

function DeleteReglement({ donner, setDonner, reglement }: Props) {
  const [motif, setMotif] = React.useState<string>("");
  const deleteData = async () => {
    try {
      const res = await fetch("/api/caisse/reglement", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ motif_deleted: motif, id: reglement }),
      });
      const response = await res.json();

      if (response.status === 200) {
        console.log(response);
        setDonner(
          donner.map((x) => (x.id === response.data.id ? response.data : x))
        );
        setMotif("");
      } else {
        toast(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>
        <Label>Motif de suppression</Label>
        <Input
          value={motif}
          placeholder="Motif"
          className="mt-3"
          onChange={(e) => setMotif(e.target.value)}
        />
      </div>
      <Button className="mt-3 w-full" onClick={() => deleteData()}>
        Save
      </Button>
    </div>
  );
}

export default DeleteReglement;
