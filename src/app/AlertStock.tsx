import { CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Popup from "./Tools/Popup";
import Tableau_set_Header from "./Tools/Tab_set_Header";

interface IAlerte {
  produit: string;
  idUnite: string;
  quantite: number;
  alerte: number;
}

type Props = {
  produits: IAlerte[];
};

const keyColonnes = [
  { title: "produit", accessorKey: "produit" },
  { title: "Unite", accessorKey: "idUnite" },
  { title: "quantite", accessorKey: "quantite" },
  { title: "alerte", accessorKey: "alerte" },
];

function AlertStock({ produits }: Props) {
  return (
    <div className="grid w-full  items-start gap-4">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>
          Veuillez noter que le stock de {produits.length} produits est presque
          épuisé.
        </AlertTitle>
        <AlertDescription
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <p>
            Nous vous invitons à passer votre commande rapidement afin
            d&apos;éviter que ces articles ne passent en rupture de stock.
          </p>
          <Popup
            title=""
            component={
              <div style={{ overflow: "auto", height: "100vh" }}>
                <Tableau_set_Header
                  data={produits}
                  columns={keyColonnes}
                  customer_id="produit"
                />
              </div>
            }
            btnname="Voir plus"
          />
        </AlertDescription>
      </Alert>
    </div>
  );
}
export default AlertStock;
