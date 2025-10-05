"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";
import { IInfo_Ouverture } from "../../Interfaces/ICaisse";
import Loading from "../../Tools/Loading";

interface Initiale {
  cash_usd: string;
  cash_cdf: string;
  commentaire_fermeture: string;
}

function Fermeture() {
  //cash, commentaire_fermeture, cash_virtuelle, idCaisse
  const [load, setLoad] = React.useState<boolean>(true);
  const [information, setInformation] = React.useState<IInfo_Ouverture>({
    taux: 0,
    depense: 0,
    montant_vendu: 0,
    tot_caisse: 0,
    date: "",
  });
  const [initiale, setInitiale] = React.useState<Initiale>({
    cash_cdf: "",
    cash_usd: "",
    commentaire_fermeture: "",
  });
  const { cash_cdf, cash_usd, commentaire_fermeture } = initiale;
  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInitiale({
      ...initiale,
      [e.target.name]: e.target.value,
    });
  };
  const loadingInformation = async () => {
    try {
      const res = await fetch("/api/caisse/fermeture", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.status === 200) {
        setInformation(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingInformation();
      setLoad(false);
    };
    initialize();
  }, []);

  const returnTotalEspece = () => {
    const usd_en_cdf =
      cash_usd && parseFloat(cash_usd) > 0
        ? parseFloat(cash_usd) * information?.taux
        : 0;
    return usd_en_cdf + (cash_cdf !== "" ? parseInt(cash_cdf) : 0);
  };
  const manquant = () => {
    return information.tot_caisse - returnTotalEspece();
  };
  const sendData = async () => {
    try {
      setLoad(true);
      const res = await fetch("/api/caisse/fermeture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...initiale,
          cash_virtuelle: information?.tot_caisse,
          manquant: information.tot_caisse - returnTotalEspece(),
        }),
      });
      const response = await res.json();
      if (response.status === 201) {
        toast(response.message);
      }
      if (response.status === 200) {
        toast("Opération effectuée avec succès", { duration: 10000 });
        window.location.replace("/caisse");
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
          <div className="mb-8">
            <p className="text-center">Date : {information.date}</p>
          </div>
          <div className="flex justify-between mb-3">
            <div>
              <p className="text-center">Montant vendu</p>
              <p className="text-center font-extrabold">
                {information?.montant_vendu} CDF
              </p>
            </div>
            <div>
              <p className="text-center">Sortie</p>
              <p className="text-center font-extrabold">
                {information?.depense} CDF
              </p>
            </div>
            <div>
              <p className="text-center">Total en caisse</p>
              <p className="text-center font-extrabold">
                {information?.tot_caisse} CDF
              </p>
            </div>
          </div>
          <div>
            <Label className="mb-3">Cash en USD *</Label>
            <Input
              placeholder="Entrer le Cash en USD *"
              name="cash_usd"
              type="number"
              onChange={(e) => onchange(e)}
              value={cash_usd}
            />
          </div>
          <div className="mb-3 mt-3">
            <Label className="mb-3">Cash en CDF *</Label>
            <Input
              type="number"
              placeholder="Entrer le Cash en CDF *"
              name="cash_cdf"
              onChange={(e) => onchange(e)}
              value={cash_cdf}
            />
          </div>
          <div>
            <Label className="mb-3">Commentaire (facultatif)</Label>
            <Input
              placeholder="Commentaire (facultatif)"
              name="commentaire_fermeture"
              value={commentaire_fermeture}
              onChange={(e) => onchange(e)}
            />
          </div>
          <div className="flex justify-between mb-3">
            <div>
              <p className="text-center">Total en espèce</p>
              <p className="text-center font-extrabold">
                {returnTotalEspece()} CDF
              </p>
            </div>
            <div>
              <p className="text-center text-red-500">Manquant</p>
              <p className="text-center font-extrabold text-red-500">
                {manquant()} CDF
              </p>
            </div>
          </div>
          <div>
            <Button onClick={() => sendData()} className="w-full mt-3">
              Fermer la caisse
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Fermeture;
