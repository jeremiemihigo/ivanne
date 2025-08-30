import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

function AddUnite() {
  const [unite, setUnite] = React.useState<string>("");
  const sendData = async () => {
    try {
      const res = await fetch("/api/unite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unite),
      });
      const response = await res.json();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>
        <Input
          placeholder="Unité"
          value={unite}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUnite(e.target.value)
          }
          type="text"
        />
      </div>
      <Button onClick={() => sendData()} className="w-full mt-3">
        Valider
      </Button>
    </div>
  );
}

export default AddUnite;
