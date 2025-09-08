export interface ICaisse {
  actif: boolean;
  agent: string;
  designation: string;
  updatedAt: string;
  idCaisse: string;
  statut: "Ouvert" | "Fermer";
}
export interface IInfo_Ouverture {
  taux: number;
  montant_vendu: number;
  depense: number;
  tot_caisse: number;
  date: string;
}
export interface IReglement {
  idFacture: string;
  montant: number;
  dateSave: number;
  saved_by: string;
  date_deleted: string;
  deletedby: string;
  motif_deleted: string;
  actif: boolean;
  client: string;
  id: string;
}
export interface IDetailCaisse {
  idCaisse: string;
  initiale_usd: number;
  initiale_cdf: number;
  commentaire_ouverture: string;
  dateSave: string | number;
  ouvert_par: string;
  cash_usd: number;
  cash_cdf: number;
  cash_virtuelle: number;
}
