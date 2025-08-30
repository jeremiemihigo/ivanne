export interface IUser {
  name: string;
  username: string;
  fonction: "admin" | "user";
  actif: boolean;
  id: string;
  connect: boolean;
}
