import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import Loading from "../Tools/Loading";

interface IData {
  produit: string;
  quantite: number;
  prix_vente: string;
  prix_achat?: number;
  produitname: string;
  prix_vente_total: number;
}
type Props = {
  data: IData[];
  client: string;
  resetData: () => void;
  setData: React.Dispatch<React.SetStateAction<IData[]>>;
};
type TMessage = {
  type: "destructive" | "default" | "";
  message: string;
};

function Factures({ data, client, setData, resetData }: Props) {
  const [payer, setPayer] = React.useState<number>(0);
  const [load, setLoad] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<TMessage>({
    type: "",
    message: "",
  });
  const sendData = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoad(true);
      const res = await fetch("/api/vente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: data,
          payer,
          client,
          prix_vente: data.reduce(
            (sum, item) => sum + (item.prix_vente_total || 0),
            0
          ),
        }),
      });
      const response = await res.json();
      if (response.status === 200) {
        setMessage({
          type: "default",
          message: "Opération de vente effectuée",
        });
        setLoad(false);
        setPayer(0);
        resetData();
      } else {
        setMessage({ type: "destructive", message: response.data });
        setLoad(false);
      }
    } catch (error) {
      setLoad(false);
      setMessage({ type: "destructive", message: JSON.stringify(error) });
    }
  };
  const deleteProduct = (produit: string) => {
    setData(data.filter((x) => x.produit !== produit));
  };
  return (
    <main className="mx-auto min-w-[60%]  sm:pl-3">
      {load ? (
        <Loading />
      ) : (
        <article className="page bg-white rounded-2xl shadow-xl no-print-shadow p-10 sm:p-14 mb-10 print:rounded-none">
          {message.type !== "" && (
            <Alert variant={message.type}>
              <AlertTitle>
                {message.type === "destructive" ? "Error !" : "Success"}
              </AlertTitle>
              <AlertDescription>{message.message}</AlertDescription>
            </Alert>
          )}
          <section className="border-b-2 border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-1xl font-bold text-gray-800 mb-2">
                  IVANNE PHARMACIE
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed"></p>
              </div>
              <div className="text-right">
                <h2 className="text-1xl font-semibold text-gray-800 mb-2">
                  FACTURE
                </h2>
                <p className="text-sm text-gray-600">
                  Date: {new Date().toLocaleDateString("fr-FR")} <br />
                  Client: {client}
                </p>
              </div>
            </div>
          </section>

          {/* Products Table */}
          <section className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1 text-left font-semibold text-gray-700">
                      #
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-left font-semibold text-gray-700">
                      Produit
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-center font-semibold text-gray-700">
                      Quantité
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-right font-semibold text-gray-700">
                      PU
                    </th>
                    <th className="border border-gray-300 px-2 py-1 text-right font-semibold text-gray-700">
                      PV.T
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 &&
                    data.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td
                          onClick={() => deleteProduct(item.produit)}
                          className="border border-gray-300 px-2 py-1 cursor-pointer text-blue-500"
                        >
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-gray-700">
                          {item.produitname}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center text-gray-700">
                          {item.quantite}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right text-gray-700">
                          {item.prix_vente.toLocaleString()} CDF
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right text-gray-700">
                          {parseInt(item.prix_vente) * item.quantite} CDF
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Summary Section */}
          <section className="mb-8">
            <div className="flex justify-end">
              <div className="w-80">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700 font-medium">
                        Prix de vente total:
                      </td>
                      <td className="py-2 text-right text-gray-700 font-semibold">
                        {data.reduce(
                          (sum, item) => sum + (item.prix_vente_total || 0),
                          0
                        )}
                        CDF
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 text-gray-700 font-medium">
                        Total payé:
                      </td>
                      <td className="py-2 text-right text-gray-700 font-semibold">
                        {payer.toLocaleString()} CDF
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="py-3 text-gray-800 font-bold">
                        Reste à payer:
                      </td>
                      <td className="py-3 text-right text-gray-800 font-bold">
                        {Math.max(
                          0,
                          data.reduce(
                            (sum, item) => sum + (item.prix_vente_total || 0),
                            0
                          ) - payer
                        ).toLocaleString()}{" "}
                        CDF
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="border-t-2 border-gray-200 pt-6">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant payé (CDF)
                </label>
                <Input
                  type="number"
                  placeholder="Entrez le montant payé"
                  value={payer || ""}
                  onChange={(e) => setPayer(parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={(e) => sendData(e)}
                className="w-full  text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                disabled={
                  client === "anonyme" &&
                  payer <
                    data.reduce(
                      (sum, item) => sum + (parseInt(item.prix_vente) || 0),
                      0
                    )
                }
              >
                Valider la facture
              </Button>
            </div>
          </section>

          {/* Footer */}
          <section className="mt-10 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
            <p>Merci pour votre confiance !</p>
          </section>
        </article>
      )}
    </main>
  );
}

export default Factures;
