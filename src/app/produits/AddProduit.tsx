import { ICombo, IUnite } from "@/app/Interfaces/IOther";
import { Combobox } from "@/app/Tools/Combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { IProduit } from "../Interfaces/Produit";
import Loading from "../Tools/Loading";

type Props = {
  setDonner: React.Dispatch<React.SetStateAction<IProduit[]>>;
  donner: IProduit[];
  produit?: IProduit;
};
interface Initiale {
  produit: string;
  prix_achat: string;
  prix_vente: string;
  alerte: number;
}

function AddProduit({ setDonner, donner, produit }: Props) {
  console.log(produit);
  //produit, prix_achat, prix_vente, idUnite
  const [data, setData] = React.useState<ICombo[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [unite, setUnite] = React.useState<string>("");
  const loadingData = async () => {
    const result = await fetch("/api/unite", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();

    if (result.status === 200) {
      const donner: IUnite[] = response.data;
      const resultat = donner.map((x) => {
        return {
          label: x.unite,
          value: x.idUnite,
        };
      });

      setData(resultat);
      setLoading(false);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      loadingData();
    };
    initialize();
  }, []);
  const [initiale, setInitiale] = React.useState<Initiale>({
    produit: "",
    prix_achat: "",
    prix_vente: "",
    alerte: 0,
  });
  const onchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInitiale({
      ...initiale,
      [name]: value,
    });
  };
  const sendData = async () => {
    try {
      if (parseInt(initiale.prix_vente) < parseInt(initiale.prix_achat)) {
        toast("Le prix de vente est inférieur au prix d'achat");
        return;
      } else {
        setLoading(true);
        const { produit, prix_achat, prix_vente, alerte } = initiale;
        const donners = {
          produit,
          prix_achat,
          prix_vente,
          idUnite: unite,
          alerte,
        };
        const res = await fetch("/api/produit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(donners),
        });
        const response = await res.json();
        if (response.status === 200) {
          setDonner([response.data, ...donner]);
          setInitiale({
            produit: "",
            prix_achat: "",
            prix_vente: "",
            alerte: 0,
          });
          setUnite("");
          toast("Opération effectuée avec succès");
          setLoading(false);
        } else {
          toast(JSON.stringify(response.data));
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateData = async () => {
    try {
      if (parseInt(initiale.prix_vente) < parseInt(initiale.prix_achat)) {
        toast("Le prix de vente est inférieur au prix d'achat");
      } else {
        setLoading(true);
        const donners = {
          produit: initiale.produit,
          prix_achat: initiale.prix_achat,
          prix_vente: initiale.prix_vente,
          idUnite: unite,
          alerte: initiale.alerte,
          id: produit?._id,
        };

        const res = await fetch("/api/produit", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(donners),
        });
        const response = await res.json();
        if (response.status === 200) {
          setDonner(
            donner.map((x) =>
              x.produit === produit?.produit ? response.data : x
            )
          );
          setInitiale({
            produit: "",
            prix_achat: "",
            prix_vente: "",
            alerte: 0,
          });
          setUnite("");
          toast("Opération effectuée avec succès");
          setLoading(false);
        } else {
          toast(JSON.stringify(response.data));
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (produit && data.length > 0) {
      setInitiale({
        produit: produit.produit,
        prix_achat: produit.prix_achat.toString(),
        prix_vente: produit.prix_vente.toString(),
        alerte: produit.alerte,
      });
      setUnite(data.filter((x) => x.label === produit.unite)[0]?.value);
    }
  }, [produit, data]);

  const input = [
    { id: 1, placeholder: "Designation", name: "produit" },
    { id: 2, placeholder: "Prix d'achat unitaire", name: "prix_achat" },
    { id: 3, placeholder: "Prix de vente unitaire", name: "prix_vente" },
    { id: 4, placeholder: "Quantité d'alerte", name: "alerte" },
  ];
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          {input.map((index) => {
            return (
              <div className="mt-2 mb-2" key={index.id}>
                <Label className="mb-3 mt-3">{index.placeholder}</Label>
                <Input
                  placeholder={index.placeholder}
                  name={index.name}
                  onChange={(e) => onchange(e)}
                  value={initiale[index.name as keyof Initiale]}
                />
              </div>
            );
          })}
          <div className="mt-2 mb-2">
            <Label className="mb-3 mt-3">Unité</Label>
            <Combobox value={unite} data={data} setValue={setUnite} />
          </div>

          <div>
            <Button
              onClick={produit ? () => updateData() : () => sendData()}
              className="w-full"
            >
              {produit ? <Edit /> : <Save />}
              {produit ? "Modification" : "Valider"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default AddProduit;
