"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";
import { IApprovisionnement } from "../Interfaces/IApprovisionnement";
import { ICombo } from "../Interfaces/IOther";
import { ITiers } from "../Interfaces/ITiers";
import { IProduit } from "../Interfaces/Produit";
import { Combobox } from "../Tools/Combobox";
import Loading from "../Tools/Loading";

interface IProducts {
  quantite: number;
  prix_achat: number;
  prix_vente: number;
}

interface Initiale {
  quantite: string;
  num_lot: string;
  prix_achat: string;
  prix_vente: string;
  dateFabrication: string;
  date_peremption: string;
  reference?: string;
}
type Props = {
  setDonner: React.Dispatch<React.SetStateAction<IApprovisionnement[]>>;
  donner: IApprovisionnement[];
};
type IInput = {
  placeholder: string;
  type: string;
  name: string;
};

function Approvisionnement({ setDonner, donner }: Props) {
  const [data, setData] = React.useState<ICombo[]>([]);
  const [allfournisseur, setAllFournisseur] = React.useState<ICombo[]>([]);
  const [fournisseur, setFournisseur] = React.useState<string>("");
  const [produit, setProduit] = React.useState<string>("");
  const [load, setLoad] = React.useState<boolean>(true);
  const [values, setValues] = React.useState<Initiale>({
    quantite: "",
    num_lot: "",
    prix_achat: "",
    prix_vente: "",
    dateFabrication: "",
    date_peremption: "",
    reference: "",
  });

  const loadingData = async () => {
    const result = await fetch("/api/produit", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      const produits: IProduit[] = response.data;
      const donner: ICombo[] = produits.map((index) => {
        return {
          value: index.idProduit,
          label: index.produit,
        };
      });
      setData(donner);
      setLoad(false);
    }
  };
  const loadingProduit = async () => {
    try {
      if (produit !== "") {
        setLoad(true);
        const res = await fetch(`/api/produit/information/${produit}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await res.json();
        if (result.status === 200) {
          const donner: IProducts = result.data;
          setValues({
            ...values,
            prix_achat: donner.prix_achat.toString(),
            prix_vente: donner.prix_vente.toString(),
          });
          setLoad(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const loadingApprovisionnement = async () => {
    const result = await fetch("/api/tiers/fournisseur", {
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
      setAllFournisseur(donner);
      setLoad(false);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingProduit();
    };
    initialize();
  }, [produit]);
  React.useEffect(() => {
    const initialize = async () => {
      await loadingData();
      await loadingApprovisionnement();
    };
    initialize();
  }, []);

  const onchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const input1: IInput[] = [
    { placeholder: "Quantité", name: "quantite", type: "text" },
    { placeholder: "Prix d'achat unitaire", name: "prix_achat", type: "text" },
    { placeholder: "Prix de vente unitaire", name: "prix_vente", type: "text" },
  ];
  const input2: IInput[] = [
    {
      placeholder: "Date de fabrication",
      name: "dateFabrication",
      type: "date",
    },
    {
      placeholder: "Date de peremption",
      name: "date_peremption",
      type: "date",
    },
    { placeholder: "Numero Lot", name: "num_lot", type: "text" },
  ];

  const sendData = async () => {
    try {
      setLoad(true);
      if (parseInt(values.prix_vente) < parseInt(values.prix_achat)) {
        toast("Le prix d'achat est inférieur au prix de vente");
        setLoad(false);
        return;
      } else {
        const res = await fetch("/api/approvisionnement", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, fournisseur, idProduit: produit }),
        });
        const response = await res.json();
        if (response.status === 200) {
          setDonner([...donner, response.data]);
          setValues({
            quantite: "",
            num_lot: "",
            dateFabrication: "",
            date_peremption: "",
            prix_achat: "",
            prix_vente: "",
          });
          setProduit("");
          setLoad(false);
        } else {
          toast(JSON.stringify(response.data));
          setLoad(false);
        }
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
          {" "}
          <div className="flex gap-3 w-full">
            <div>
              <Label className="mb-3 mt-3">Selectionner le Produit</Label>
              <Combobox value={produit} setValue={setProduit} data={data} />
              {input1.map((index, key) => {
                return (
                  <div key={key}>
                    <Label className="mb-3 mt-3" htmlFor={index.name}>
                      {index.placeholder}
                    </Label>
                    <Input
                      name={index.name}
                      placeholder={index.placeholder}
                      value={values[index.name as keyof Initiale]}
                      onChange={(e) => onchange(e)}
                      type={index.type}
                    />
                  </div>
                );
              })}
            </div>
            <div>
              {input2.map((index, key) => {
                return (
                  <div key={key}>
                    <Label className="mb-3 mt-3" htmlFor={index.name}>
                      {index.placeholder}
                    </Label>
                    <Input
                      name={index.name}
                      placeholder={index.placeholder}
                      value={values[index.name as keyof Initiale]}
                      onChange={(e) => onchange(e)}
                      type={index.type}
                    />
                  </div>
                );
              })}
              <Label className="mb-3 mt-3" htmlFor="Fournisseur">
                Fournisseur
              </Label>
              <Combobox
                value={fournisseur}
                setValue={setFournisseur}
                data={allfournisseur}
              />
            </div>
          </div>
          <div>
            <Label className="mb-3 mt-3" htmlFor="reference">
              Emplacement dans la pharmacie
            </Label>
            <Input
              name="reference"
              placeholder="Emplacement dans la pharmacie"
              value={values.reference}
              onChange={(e) => onchange(e)}
              type="text"
            />
          </div>
          <Button onClick={() => sendData()} className="w-full mt-3">
            Valider
          </Button>
        </>
      )}
    </div>
  );
}

export default Approvisionnement;
