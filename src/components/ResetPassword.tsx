import React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Initiale {
  first: string;
  second: string;
}
function ResetPassword() {
  const [password, setPassword] = React.useState<Initiale>({
    first: "",
    second: "",
  });
  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value,
    });
  };
  const sendData = async () => {
    try {
      if (password.first !== password.second) {
        toast("Le mot de passe doit être égal");
        return;
      } else {
        const res = await fetch("/api/password/change_default", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword: password.first }),
        });
        const result = await res.json();
        if (result.data === 200) {
          window.location.replace("/login");
        }
      }
    } catch (error) {
      toast(JSON.stringify(error));
    }
  };
  return (
    <div>
      <div>
        <Input
          placeholder="Nouveau mot de passe"
          name="first"
          value={password.first}
          type="password"
          onChange={(e) => onchange(e)}
        />
      </div>
      <div className="mt-3 mb-3">
        <Input
          placeholder="Repeter le mot de passe"
          name="second"
          value={password.second}
          type="password"
          onChange={(e) => onchange(e)}
        />
      </div>
      <div className="mt-2">
        <Button onClick={() => sendData()} className="w-full">
          Valider
        </Button>
      </div>
    </div>
  );
}

export default ResetPassword;
