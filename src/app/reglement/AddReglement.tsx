import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { IReglement } from "../Interfaces/ICaisse";
import { ICombo } from "../Interfaces/IOther";
import { ITiers } from "../Interfaces/ITiers";
import { Combobox } from "../Tools/Combobox";
import Loading from "../Tools/Loading";

type Props = {
  data: IReglement[];
  setData: React.Dispatch<React.SetStateAction<IReglement[]>>;
};

function AddReglement({ data, setData }: Props) {
  const [load, setLoading] = React.useState<boolean>(true);
  const [clients, setAllClients] = React.useState<ICombo[]>([]);
  const [client, setClient] = React.useState<string>("");
  const [factures, setFactures] = React.useState<ICombo[]>([]);
  const [facture, setFacture] = React.useState<string>("");
  const [montant, setMontant] = React.useState<string>("");
  const loadingClient = async () => {
    const result = await fetch("/api/tiers/client", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      const fournisseur: ITiers[] = response.data;
      const donner: ICombo[] = fournisseur.map((index) => {
        return {
          value: index.id,
          label: index.name,
        };
      });
      setAllClients(donner);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingClient();
      setLoading(false);
    };
    initialize();
  }, []);
  const loadingFacture = async () => {
    try {
      if (client !== "") {
        setLoading(true);
        const res = await fetch(`/api/caisse/${client}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        if (response.status === 200) {
          setFactures(response.data);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingFacture();
    };
    initialize();
  }, [client]);

  const sendData = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/caisse/reglement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idFacture: facture,
          montant,
        }),
      });
      const response = await res.json();
      console.log(response);
      if (response.status === 200) {
        setData([response.data, ...data]);
        toast("Reglement enregistré avec succès");
        setMontant("");
      } else {
        toast(JSON.stringify(response.message));
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
            <Combobox
              title="Selectionnez le client"
              data={clients}
              value={client}
              setValue={setClient}
            />
          </div>
          {factures.length > 0 && (
            <div className="mt-3">
              <div>
                <Combobox
                  data={factures}
                  setValue={setFacture}
                  value={facture}
                  title="Selectionnez la facture"
                />
              </div>
              <div className="mt-3">
                <Input
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  placeholder="Montant"
                  type="number"
                />
              </div>
              <div className="mt-3">
                <Button onClick={(e) => sendData(e)} className="w-full">
                  <Plus /> Valider
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AddReglement;
