import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";
import { toast } from "sonner";

interface ILogin {
  username: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [initiale, setInitiale] = React.useState<ILogin>({
    username: "",
    password: "",
  });
  const [load, setLoad] = React.useState<boolean>(false);

  const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoad(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initiale),
      });
      const data = await res.json();
      console.log(data);
      if (data.message === "success") {
        window.location.replace("/");
      } else {
        toast(JSON.stringify(data.message), { duration: 10000 });
        setLoad(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast("An unknown error occurred");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(/image.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={cn("w-full max-w-md mx-4", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Connectez-vous à votre compte</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInitiale({
                        ...initiale,
                        username: e.target.value,
                      })
                    }
                    id="username"
                    type="text"
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mot de passe</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInitiale({
                        ...initiale,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={load}>
                    Se connecter
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
