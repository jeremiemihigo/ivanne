//const localhost = "http://localhost:4000";
const localhost = "https://iv.bboxxvm.com";
//const localhost = "https://iv.bboxxvm.com";
export const lien = `${localhost}/pharmacie`;
export const permissions = [
  {
    value: "#01",
    label: "Tableau de bord",
    description:
      "Si vous désactiver cette option l'utilisateur ne verra plus les détails du Dashboard hormis les détails journaliers",
  },
  {
    value: "#02",
    label: "Créer un produit",
    description:
      "Permet à l'utilisateur d'ajouter de nouveaux produits dans l'inventaire de la pharmacie",
  },
  {
    value: "#03",
    label: "Editer un produit",
    description:
      "Permet à l'utilisateur de modifier les informations des produits existants",
  },
  {
    value: "#04",
    label: "Reapprovisionner le stock",
    description:
      "Permet à l'utilisateur d'ajouter des quantités aux produits en stock",
  },
  {
    value: "#05",
    label: "Ajuster le stock",
    description:
      "Permet à l'utilisateur de modifier manuellement les quantités en stock",
  },
  {
    value: "#06",
    label: "Modifier le prix en caisse",
    description:
      "Permet à l'utilisateur de modifier le prix de vente pendant le processus de vente",
  },
  {
    value: "#07",
    label: "Effectuer des ventes",
    description: "Permet à l'utilisateur de réaliser des ventes de produits",
  },
  {
    value: "#08",
    label: "Annuler une facture",
    description: "Permet à l'utilisateur de supprimer des factures de vente",
  },
  {
    value: "#09",
    label: "Enregistrer une perte",
    description:
      "Permet à l'utilisateur d'enregistrer les pertes de produits (vol, péremption, etc.)",
  },
  {
    value: "#10",
    label: "Supprimer une perte",
    description:
      "Permet à l'utilisateur de supprimer les enregistrements de pertes",
  },
  {
    value: "#11",
    label: "Rapport produit individuel",
    description:
      "Permet à l'utilisateur de générer des rapports détaillés pour chaque produit",
  },
  {
    value: "#12",
    label: "Rapport commercial",
    description:
      "Permet à l'utilisateur de générer des rapports sur les ventes et performances commerciales",
  },
  {
    value: "#13",
    label: "Rapport d'inventaire",
    description:
      "Permet à l'utilisateur de générer un rapport complet de l'état actuel de l'inventaire",
  },
  {
    value: "#14",
    label: "Rapport rupture de stock",
    description:
      "Permet à l'utilisateur de générer un rapport des produits qui sont en rupture de stock",
  },
  {
    value: "#15",
    label: "Créer un utilisateur",
    description:
      "Permet à l'utilisateur de créer de nouveaux comptes utilisateurs dans le système",
  },
  {
    value: "#16",
    label: "Suspendre un utilisateur",
    description:
      "Permet à l'utilisateur de désactiver ou bloquer l'accès d'autres utilisateurs",
  },
  {
    value: "#17",
    label: "Gérer les taux de change",
    description:
      "Permet à l'utilisateur de configurer et modifier les taux de change pour les devises",
  },
  {
    value: "#18",
    label: "Enregistrer une dépense",
    description:
      "Permet à l'utilisateur d'enregistrer de nouvelles dépenses de la pharmacie",
  },
  {
    value: "#19",
    label: "Supprimer une dépense",
    description:
      "Permet à l'utilisateur de supprimer les enregistrements de dépenses",
  },
  {
    value: "#20",
    label: "Ouverture et clôture de la caisse",
    description:
      "Permet à l'utilisateur d'ouvrir et fermer la caisse pour les opérations quotidiennes",
  },
  {
    value: "#21",
    label: "Rapport journalier",
    description:
      "Permet à l'utilisateur de générer des rapports sur les activités et transactions du jour",
  },
];
