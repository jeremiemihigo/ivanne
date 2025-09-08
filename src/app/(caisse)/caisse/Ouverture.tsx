import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";

interface Initiale {
  initiale_usd: string;
  initiale_cdf: string;
  commentaire_ouverture: string;
}
function Ouverture() {
  //idCaisse, responsable, initiale, commentaire_ouverture
  const [initiale, setInitiale] = React.useState<Initiale>({
    initiale_cdf: "",
    initiale_usd: "",
    commentaire_ouverture: "",
  });
  const { initiale_cdf, initiale_usd, commentaire_ouverture } = initiale;
  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInitiale({
      ...initiale,
      [e.target.name]: e.target.value,
    });
  };
  const sendData = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      const res = await fetch("/api/caisse/ouverture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initiale),
      });
      const response = await res.json();
      if (response.status === 200) {
        toast("Caisse ouverte avec succès", { duration: 10000 });
        window.location.replace("/caisse");
      } else {
        toast(response.message, { duration: 15000 });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>
        <Label className="mb-3">Initiale en USD *</Label>
        <Input
          placeholder="Initiale en USD *"
          name="initiale_usd"
          onChange={(e) => onchange(e)}
          type="number"
          value={initiale_usd}
        />
      </div>
      <div className="mt-3">
        <Label className="mb-3">Initiale en CDF *</Label>
        <Input
          placeholder="Initiale en CDF*"
          name="initiale_cdf"
          onChange={(e) => onchange(e)}
          type="number"
          value={initiale_cdf}
        />
      </div>
      <div className="mb-3 mt-3">
        <Label className="mb-3">Commentaire</Label>
        <Input
          placeholder="Commentaire (facultatif)"
          name="commentaire_ouverture"
          onChange={(e) => onchange(e)}
          value={commentaire_ouverture}
          type="number"
        />
      </div>
      <div>
        <Button className="w-full" onClick={(e) => sendData(e)}>
          Ouvrir la caisse
        </Button>
      </div>
    </div>
  );
}

export default Ouverture;
