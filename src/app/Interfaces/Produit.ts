export interface IProduit {
  produit: string;
  idProduit: string;
  prix_achat: number;
  prix_vente: number;
  alerte: number;
  unite: string;
  reference: string;
  _id: string;
}
export interface IventePerte {
  produit: string;
  prix_vente: number;
  perte: number;
  dateSave: number;
  montant: number;
  facture: string;
  client: string;
  saveby: string;
}
