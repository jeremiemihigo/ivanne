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
