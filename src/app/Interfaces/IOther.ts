export interface ICombo {
  value: string;
  label: string;
}
export interface IUnite {
  doby: string;
  idUnite: string;
  unite: string;
}

export interface IDepense {
  _id: string;
  motif: string;
  montant: string;
  dateSave: string;
  doby: string;
  actif: boolean;
  deleted_by?: string;
  motif_delete?: string;
}
