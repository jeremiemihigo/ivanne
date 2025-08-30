"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import { Combobox } from "../../Tools/Combobox";

interface IData {
  username: string;
  name: string;
}
function Formulaire() {
  const [fonction, setValue] = React.useState<string>("");
  const [initiale, setInitiale] = React.useState<IData>({
    name: "",
    username: "",
  });
  const data = [
    { label: "Super user", value: "admin" },
    { label: "User", value: "user" },
  ];
  // name,
  // username,
  // fonction,
  const saveData = async () => {
    const data = { fonction, name: initiale.name, username: initiale.username };
    const result = await fetch("/api/utilisateur", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await result.json();
    if (result.status === 200) {
      toast("Done");
    } else {
      toast(response.message);
    }
  };
  return (
    <div>
      <Combobox value={fonction} data={data} setValue={setValue} />
      <div className="mt-2 mb-2">
        <Input
          type="text"
          placeholder="Nom"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInitiale({ ...initiale, name: e.target.value })
          }
        />
      </div>

      <div className="mb-2">
        <Input
          type="text"
          placeholder="Username"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInitiale({ ...initiale, username: e.target.value })
          }
        />
      </div>
      <Button onClick={() => saveData()} className="w-full">
        Ajoutez
      </Button>
    </div>
  );
}

export default Formulaire;
