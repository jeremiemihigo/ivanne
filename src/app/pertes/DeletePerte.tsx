import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import { IPerte } from "../Interfaces/IOther";
import Loading from "../Tools/Loading";

type Props = {
  id: string;
  data: IPerte[];
  setData: React.Dispatch<React.SetStateAction<IPerte[]>>;
};

function DeletePerte({ id, setData, data }: Props) {
  const [motif, setMotif] = React.useState<string>("");
  const [load, setLoad] = React.useState<boolean>(false);
  const sendData = async () => {
    try {
      setLoad(true);
      const res = await fetch("/api/perte", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ motif_deleted: motif, id }),
      });
      const result = await res.json();
      if (result.status === 200) {
        toast("Suppression effectuée avec succès");
        setData(data.map((x) => (x._id === result.data._id ? result.data : x)));
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {load ? (
        <Loading />
      ) : (
        <>
          <div>
            <Input
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Motif de suppression"
            />
          </div>
          <div className="mt-3">
            <Button onClick={() => sendData()} className="w-full">
              Valider la suppression
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default DeletePerte;
