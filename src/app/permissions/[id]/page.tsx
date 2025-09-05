"use client";
import Header from "@/app/Header/Header";
import { IUser } from "@/app/Interfaces/IUser";
import { permissions } from "@/app/Tools/Lien";
import Loading from "@/app/Tools/Loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Search, Unlock } from "lucide-react";
import React from "react";

interface OneFactureProps {
  params: Promise<{
    id: string;
  }>;
}

function Permissions({ params }: OneFactureProps) {
  const { id } = React.use(params);
  const [user, setUser] = React.useState<IUser>();
  const [load, setLoad] = React.useState<boolean>(true);
  const [mypermissions, setMypermissions] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] =
    React.useState<boolean>(false);

  const sendOne = async (permis: string) => {
    try {
      const res = await fetch(`/api/permission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, permission: permis }),
      });
      const response = await res.json();
      if (response.status === 200) {
        setUser(response.data);
        setMypermissions(response.data.permission);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };
  const laodindUser = async () => {
    try {
      const res = await fetch(`/api/permission/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.status === 200) {
        setUser(response.data);
        if (response.data.permission) {
          setMypermissions(response.data.permission);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await laodindUser();
    };
    initialize();
  }, []);
  const addpermission = (p: string) => {
    if (mypermissions.includes(p)) {
      sendOne(p);
      setMypermissions(mypermissions.filter((x) => x !== p));
    } else {
      sendOne(p);
      setMypermissions([...mypermissions, p]);
    }
  };

  const toggleUserStatus = async () => {
    if (!user) return;

    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/utilisateur`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          value: !user.actif,
        }),
      });
      const response = await res.json();
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      permission.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Header title="Permissions">
      {load ? (
        <Loading />
      ) : (
        <>
          {/* User Information Section */}
          {user && (
            <div className="mb-6 p-4 border rounded-lg bg-card">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold">
                  Informations de l&apos;utilisateur
                </h2>
                <Button
                  onClick={toggleUserStatus}
                  disabled={isUpdatingStatus}
                  variant={
                    user.actif === true || user.actif === "Actif"
                      ? "destructive"
                      : "default"
                  }
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isUpdatingStatus ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : user.actif === true || user.actif === "Actif" ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                  {user.actif === true || user.actif === "Actif"
                    ? "Bloquer"
                    : "Débloquer"}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Nom d&apos;utilisateur
                  </p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fonction</p>
                  <p className="font-medium capitalize">{user.fonction}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <p
                    className={`font-medium ${
                      user.actif === true || user.actif === "Actif"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {user.actif === true || user.actif === "Actif"
                      ? "Actif"
                      : "Bloqué"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Permissions Section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-3">Permissions</h2>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher une permission..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Results count */}
            {searchTerm && (
              <p className="text-sm text-muted-foreground mb-3">
                {filteredPermissions.length} permission(s) trouvée(s)
              </p>
            )}
          </div>
          {filteredPermissions.map((index) => {
            return (
              <div className="flex flex-col mb-3" key={index.value}>
                <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                  <Checkbox
                    id="toggle-2"
                    name={index.value}
                    onClick={() => addpermission(index.value)}
                    checked={mypermissions.includes(index.value)}
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                  />
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      {index.value} {index.label}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {index?.description}
                    </p>
                  </div>
                </Label>
              </div>
            );
          })}

          {/* No results message */}
          {searchTerm && filteredPermissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune permission trouvée pour {searchTerm}</p>
            </div>
          )}
        </>
      )}
    </Header>
  );
}

export default Permissions;
