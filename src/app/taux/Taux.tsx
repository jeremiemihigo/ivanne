import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";

function Taux() {
  const [initiale, setInitiale] = React.useState<string>("");
  const handlesubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/taux", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taux: initiale }),
      });
      const result = await res.json();
      if (result.status === 200) {
        window.location.replace("/taux");
      } else {
        toast(JSON.stringify(result.data));
      }
    } catch (error) {
      toast(JSON.stringify(error));
    }
  };
  return (
    <div>
      <div>
        <Input
          placeholder="Taux de change"
          name="initiale"
          value={initiale}
          onChange={(e) => setInitiale(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <Button className="w-full" onClick={(e) => handlesubmit(e)}>
          Valider
        </Button>
      </div>
    </div>
  );
}

export default Taux;
