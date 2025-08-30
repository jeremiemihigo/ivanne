import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";
import { IFacture } from "../Interfaces/IFacture";

type Props = {
  donner: IFacture[];
  setDonner: React.Dispatch<React.SetStateAction<IFacture[]>>;
  facture: string;
};

function Delete({ donner, setDonner, facture }: Props) {
  const [motif, setMotif] = React.useState<string>("");
  const deleteData = async () => {
    try {
      const res = await fetch("/api/facture", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ motif_suppression: motif, id: facture }),
      });
      const response = await res.json();

      if (response.status === 200) {
        setDonner(
          donner.map((x) => (x._id === response.data._id ? response.data : x))
        );
        setMotif("");
      } else {
        toast(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>
        <Label>Motifi de suppression</Label>
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

export default Delete;
