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
  entrer: number;
  sortie: number;
  initiale: number;
  produit: number;
  solde: number;
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
