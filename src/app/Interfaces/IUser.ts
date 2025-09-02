export interface IUser {
  name: string;
  username: string;
  fonction: "admin" | "user";
  actif: boolean | "Actif" | "Bloquer";
  id: string;
  connect: boolean;
}
