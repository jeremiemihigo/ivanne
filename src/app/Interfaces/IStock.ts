export interface IStock {
  produit: string;
  prix_achat: string;
  prix_vente: string;
  unite: string;
  quantite: number;
  doby: string;
  idProduit: string;
}

export interface IAjustage {
  Produit: string;
  Date: string;
  Ancienne_Qte: number;
  Nouvelle_Qte: number;
  Motif: string;
  Par: string;
}
