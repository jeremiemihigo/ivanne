"use client";
import { IUser } from "@/app/Interfaces/IUser";
import Loading from "@/app/Tools/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";
import { Combobox } from "../../Tools/Combobox";

interface IData {
  username: string;
  name: string;
}
type Props = {
  data: IUser[];
  setData: React.Dispatch<React.SetStateAction<IUser[]>>;
};
function Formulaire({ data, setData }: Props) {
  const [load, setLoad] = React.useState<boolean>(false);
  const [fonction, setValue] = React.useState<string>("");
  const [initiale, setInitiale] = React.useState<IData>({
    name: "",
    username: "",
  });
  const datas = [
    { label: "Administrateur", value: "admin" },
    { label: "Vendeur", value: "user" },
  ];

  const saveData = async () => {
    setLoad(true);
    const donners = {
      fonction,
      name: initiale.name,
      username: initiale.username,
    };
    const result = await fetch("/api/utilisateur", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(donners),
    });
    const response = await result.json();
    if (result.status === 200) {
      setLoad(false);
      setData([response.data, ...data]);
      toast("Opération effectuée avec succès");
    } else {
      setLoad(false);
      toast(JSON.stringify(response.data));
    }
  };
  return (
    <div>
      {load ? (
        <Loading />
      ) : (
        <>
          <Combobox value={fonction} data={datas} setValue={setValue} />
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
        </>
      )}
    </div>
  );
}

export default Formulaire;
