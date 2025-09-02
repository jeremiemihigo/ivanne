import { IProformaOneFacture } from "@/app/Interfaces/IFacture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  montant: number;
  client: string;
  data: IProformaOneFacture[];
};

function Payer({ montant, client, data }: Props) {
  const [somme, setSomme] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const resteAPayer = montant - somme;
  const isMontantValide = somme >= 0 && somme <= montant;
  const isClientAnonyme = client === "anonyme";

  const sendData = async () => {
    if (!isMontantValide) {
      toast.error("Le montant payé doit être entre 0 et le montant total");
      return;
    }

    if (isClientAnonyme && resteAPayer > 0) {
      toast.error(
        "Un client non enregistré ne peut pas être emprunté par le système. Le montant payé doit être égal au montant total.",
        { duration: 10000 }
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/vente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: data,
          payer: somme,
          client,
          facture: data[0].idFacture,
          prix_vente: data[0].prix_vente,
        }),
      });
      const response = await res.json();
      if (response.status === 200) {
        toast.success("Opération de vente effectuée");
      } else {
        toast(JSON.stringify(response.data));
      }
      // Reset form after successful payment
      setSomme(0);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du paiement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMontantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setSomme(value);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="space-y-2">
        <Label htmlFor="payer" className="text-sm font-medium">
          Montant payé
        </Label>
        <Input
          id="payer"
          onChange={handleMontantChange}
          name="payer"
          value={somme || ""}
          type="number"
          min="0"
          max={montant}
          step="0.01"
          placeholder="Entrez le montant payé"
          className={`${!isMontantValide && somme > 0 ? "border-red-500" : ""}`}
        />
        {!isMontantValide && somme > 0 && (
          <p className="text-sm text-red-500">
            Le montant payé ne peut pas dépasser le montant total
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Reste à payer</Label>
        <div className="p-3 bg-gray-50 rounded-md">
          <span
            className={`text-lg font-semibold ${
              resteAPayer === 0
                ? "text-green-600"
                : resteAPayer < 0
                ? "text-red-600"
                : "text-gray-700"
            }`}
          >
            {resteAPayer.toFixed(2)} CDF
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          onClick={sendData}
          className="w-full"
          disabled={
            !isMontantValide ||
            isLoading ||
            (isClientAnonyme && resteAPayer > 0)
          }
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Enregistrement...</span>
            </div>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Valider le paiement
            </>
          )}
        </Button>
      </div>

      {isClientAnonyme && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ Client anonyme : Le montant payé doit être égal au montant total
          </p>
        </div>
      )}
    </div>
  );
}

export default Payer;
