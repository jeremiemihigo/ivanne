"use client";
import { ICaisse } from "@/app/Interfaces/ICaisse";
import { Combobox } from "@/app/Tools/Combobox";
import Loading from "@/app/Tools/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import { IEntrer } from "../../Interfaces/IOther";

interface Initiale {
  motif: string;
  montant: string;
  provenance: string;
}
type Props = {
  data: IEntrer[];
  setData: React.Dispatch<React.SetStateAction<IEntrer[]>>;
};
const devises = [
  { label: "USD", value: "USD" },
  { label: "CDF", value: "CDF" },
];
function Formulaire({ data, setData }: Props) {
  const [initiale, setInitiale] = React.useState<Initiale>({
    motif: "",
    montant: "",
    provenance: "",
  });
  const [devise, setDevise] = React.useState<string>("");

  const [caisses, setCaisses] = React.useState<ICaisse[]>([]);
  const [caisse, setCaisse] = React.useState<string>("");
  const [load, setLoad] = React.useState<boolean>(true);
  const loadingData = async () => {
    const result = await fetch("/api/caisse", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      setCaisses(response.data);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingData();
      setLoad(false);
    };
    initialize();
  }, []);

  const sendData = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/entrer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...initiale, idCaisse: caisse, devise }),
      });
      const result = await res.json();
      if (result.status === 200) {
        setData([result.data, ...data]);
        toast("Encaissement enregistré avec succès", { duration: 10000 });
        setInitiale({
          motif: "",
          montant: "",
          provenance: "",
        });
        setDevise("");
      } else {
        toast(JSON.stringify(result.message), { duration: 10000 });
      }
    } catch (error) {
      toast(JSON.stringify(error), { duration: 10000 });
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
          <div className="mb-3 mt-3">
            <Combobox value={devise} setValue={setDevise} data={devises} />
          </div>
          <div>
            <Input
              placeholder="Provenance"
              value={initiale.provenance}
              onChange={(e) => {
                setInitiale({
                  ...initiale,
                  provenance: e.target.value,
                });
              }}
            />
          </div>
          <div className="mt-3">
            <Combobox
              value={caisse}
              title="Cette somme va dans quelle caisse ?"
              setValue={setCaisse}
              data={caisses.map((x) => {
                return {
                  label: x.designation,
                  value: x.idCaisse,
                };
              })}
            />
          </div>
          <div className="mt-2">
            <Button className="w-full" onClick={(e) => sendData(e)}>
              Valider
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Formulaire;
