"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import Header from "../Header/Header";
import { ICombo } from "../Interfaces/IOther";
import { ITiers } from "../Interfaces/ITiers";
import { IProduit } from "../Interfaces/Produit";
import { Combobox } from "../Tools/Combobox";
import Loading from "../Tools/Loading";
import Factures from "./Facture";

interface IData {
  produit: string;
  quantite: number;
  prix_vente: string;
  prix_achat?: number;
  produitname: string;
  prix_vente_total: number;
}
interface IPrix {
  prix_achat: number;
  prix_vente: string;
  quantite: number;
  information: string;
  fonction: "admin" | "user" | "";
}
function VentePage() {
  const [clients, setAllClients] = React.useState<ICombo[]>([]);
  const [client, setClient] = React.useState<string>("");
  const [allproduits, setAllProduits] = React.useState<IProduit[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const [payerproduit, setPayerProduit] = React.useState<IPrix>({
    prix_achat: 0,
    prix_vente: "",
    quantite: 0,
    information: "",
    fonction: "",
  });
  const [data, setData] = React.useState<IData[]>([]);
  const [produit, setProduit] = React.useState<string>("");
  const [quantitevendu, setQuantiteVendu] = React.useState<string>("");
  const loadingProduit = async () => {
    try {
      const res = await fetch("/api/produit", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.status === 200) {
        setAllProduits(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const loadingApprovisionnement = async () => {
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
      setLoad(true);
      await loadingProduit();
      await loadingApprovisionnement();
      setLoad(false);
    };
    initialize();
  }, []);

  React.useEffect(() => {
    const loadingQuantiteProduit = async () => {
      try {
        if (produit !== "") {
          setLoad(true);
          const res = await fetch(`/api/produit/${produit}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const response = await res.json();
          if (response.status === 200) {
            setPayerProduit(response.data);
            setLoad(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    const initialize = async () => {
      await loadingQuantiteProduit();
    };
    initialize();
  }, [produit]);

  const ajouterPannier = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (data.filter((x) => x.produit === produit).length > 0) {
      toast("Ce produit existe déjà dans le pannier", { duration: 10000 });
      return;
    }
    if (payerproduit.quantite < parseInt(quantitevendu)) {
      toast("La quantité commandée n'est pas dans le stock", {
        duration: 10000,
      });
      return;
    }
    setData([
      ...data,
      {
        produit,
        quantite: quantitevendu !== "" ? parseInt(quantitevendu) : 0,
        prix_vente: payerproduit.prix_vente.toString(),
        prix_vente_total:
          parseInt(quantitevendu) * parseInt(payerproduit.prix_vente),
        prix_achat: payerproduit.prix_achat,
        produitname: allproduits.filter((x) => x.idProduit === produit)[0]
          .produit,
      },
    ]);
    setPayerProduit({
      prix_achat: 0,
      prix_vente: "",
      quantite: 0,
      information: "",
      fonction: "",
    });
    setProduit("");
    setQuantiteVendu("");
  };
  const resetData = () => {
    setPayerProduit({
      prix_achat: 0,
      prix_vente: "",
      quantite: 0,
      information: "",
      fonction: "",
    });
    setClient("");
    setData([]);
    setQuantiteVendu("");
  };

  return (
    <Header title="Ventes">
      <div className="flex">
        <main className="mx-auto min-w-[50%] ">
          <article className="page bg-white rounded-2xl shadow-xl no-print-shadow p-10 sm:p-14 mb-10 print:rounded-none">
            <div className="mt-2">{load && <Loading />}</div>

            {!load && (
              <section className="mt-10 border border-slate-200 rounded-xl p-8 bg-gradient-to-br from-slate-50 to-white shadow-sm">
                {produit && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {payerproduit.fonction === "admin" && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-medium text-blue-700 mb-1 flex items-center">
                            Prix d&apos;achat unitaire
                          </p>
                          <p className="text-xl font-bold text-blue-900">
                            {payerproduit.prix_achat.toLocaleString()} FC
                          </p>
                        </div>
                      )}
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-sm font-medium text-green-700 mb-1 flex items-center">
                          Quantité en stock
                        </p>
                        <p className="text-2xl font-extrabold text-green-900">
                          {payerproduit.quantite.toString()}
                        </p>
                      </div>
                      {parseInt(payerproduit.prix_vente) > 0 && (
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <p className="text-sm font-medium text-purple-700 mb-1 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                            Prix de vente unitaire
                          </p>
                          <p className="text-xl font-bold text-purple-900">
                            {payerproduit.prix_vente.toLocaleString()} FC
                          </p>
                        </div>
                      )}

                      {quantitevendu &&
                        parseInt(payerproduit.prix_vente) > 0 && (
                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <p className="text-sm font-medium text-orange-700 mb-1 flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                              Total à payer
                            </p>
                            <p className="text-2xl font-extrabold text-orange-900">
                              {(
                                parseInt(quantitevendu) *
                                parseInt(payerproduit.prix_vente)
                              ).toLocaleString()}{" "}
                              FC
                            </p>
                          </div>
                        )}
                    </div>
                    {payerproduit.information !== "" && (
                      <p className="text-lg mt-3 font-medium text-gray-700">
                        Réf : {payerproduit.information}
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Client *
                  </label>
                  <Combobox
                    data={clients}
                    value={client}
                    setValue={setClient}
                  />
                </div>
                <div className="mt-2">
                  <label className="text-sm font-medium text-gray-700">
                    Produit *
                  </label>
                  <Combobox
                    data={allproduits.map((x) => {
                      return {
                        label: x.produit,
                        value: x.idProduit,
                      };
                    })}
                    value={produit}
                    setValue={setProduit}
                  />
                </div>
                <div className="mt-2">
                  <label className="text-sm font-medium text-gray-700">
                    Quantité *
                  </label>
                  <Input
                    placeholder="Quantité"
                    name="quantite"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setQuantiteVendu(e.target.value)
                    }
                    value={quantitevendu}
                    type="number"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Prix de vente unitaire (FC) *
                  </label>
                  <Input
                    placeholder="Prix de vente unitaire"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPayerProduit({
                        ...payerproduit,
                        prix_vente: e.target.value,
                      })
                    }
                    name="payer"
                    value={payerproduit.prix_vente}
                    type="number"
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button
                  disabled={
                    payerproduit.quantite === 0 ||
                    quantitevendu === "" ||
                    parseFloat(quantitevendu) < 1
                      ? true
                      : false
                  }
                  onClick={(e) => ajouterPannier(e)}
                  className="mt-2 w-full"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                  Ajouter au panier
                </Button>
              </section>
            )}
          </article>
        </main>
        <Factures
          data={data}
          client={client}
          resetData={resetData}
          setData={setData}
        />
      </div>
    </Header>
  );
}

export default VentePage;
