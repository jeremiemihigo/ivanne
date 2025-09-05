import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";
import { IUser } from "../Interfaces/IUser";
import { Combobox } from "../Tools/Combobox";
import Loading from "../Tools/Loading";

function AjoutezCaisse() {
  //designation, agent
  const [agent, setAgent] = React.useState<string>("");
  const [designation, setDesignation] = React.useState<string>("");
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

  const sendData = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/caisse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ designation, agent }),
      });
      const response = await res.json();
      console.log(response);
      if (response.status === 200) {
        toast("Done");
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
            <Label className="mb-3">Designation</Label>
            <Input
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Désignation"
              name="caisse"
              value={designation}
            />
          </div>
          <div className="mt-3">
            <Label className="mb-3">Agent</Label>
            <Combobox
              value={agent}
              setValue={setAgent}
              data={data.map((x) => {
                return {
                  label: x.name,
                  value: x.id,
                };
              })}
            />
          </div>
          <div className="mt-3">
            <Button onClick={(e) => sendData(e)} className="w-full">
              Valider
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default AjoutezCaisse;
