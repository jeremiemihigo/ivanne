export interface IStockRapport {
  entrer: number;
  sortie: number;
  initiale: number;
  prix_vente_unitaire: number;
  produit: number;
  solde: number;
  total: number;
}
export interface IStockIndividuel {
  entrer?: number;
  sortie?: number;
  initiale?: number;
  produit?: number;
  solde?: number;
  type: "ajustage" | "situation";
  message?: string;
  date: number;
}
export interface IRapportCommerciale {
  idFacture: string;
  payer: number;
  dateSave: number;
  doby: string;
  prix_vente_total: number;
  prix_achat: number;
  benefice: number;
  client: string;
}
export interface IventaireActuel {
  idProduit: string;
  designation: string;
  unite: string;
  quantite: number;
  prix_achat_unitaire: number;
  valeur_achat_total: number;
  prix_vente_unitaire: number;
  valeur_vente_total: number;
}
export interface IProduitRupture {
  idProduit: string;
  designation: string;
  unite: string;
  quantite: number;
  mininum: number;
}
type TVente = {
  client: string;
  total: number;
};
type TEntrer = {
  montant: number;
  motif: string;
  devise: "USD" | "CDF";
  provenance: string;
  saved_by: string;
  dateSave: number;
};
type TDepense = {
  motif: string;
  montant: number;
  dateSave: number;
  doby: string;
};
export interface IRapportCaisse {
  ventes: TVente[];
  entrer: TEntrer[];
  depenses: TDepense[];
}
