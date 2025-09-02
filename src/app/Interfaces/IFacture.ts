export interface IFacture {
  client: string;
  prix_vente: number;
  payer: number;
  pu: number;
  idFacture: string;
  dateSave: string;
  doby: string;
  quantite: number;
  produit: string;
  status?: string;
  _id: string;
  deletedby?: string;
  motif_suppression?: string;
  status_facture?: boolean;
  date_deleted?: string;
}

export interface IProformaListe {
  prix_vente: number | string;
  idFacture: string;
  dateSave: number;
  doby: string;
  client: string;
  month: string;
  produits: number;
  considerer: number;
}
export interface IProformaOneFacture {
  client: string;
  idFacture: string;
  prix_vente: number;
  dateSave: number;
  doby: string;
  produit: string;
  prix_vente_total: string;
  prix_achat: string;
  produitname: string;
  quantite: number;
  prix_vente_unitaire: number;
  codeclient: string;
  considerer: number;
}
