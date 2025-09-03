"use client";
import Header from "@/app/Header/Header";
import { IShop } from "@/app/Interfaces/Shop";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import React from "react";

interface IProduitRupture {
  idProduit: string;
  designation: string;
  unite: string;
  quantite: number;
  minimum: number;
}

function ProduitRuptureStock() {
  const [data, setData] = React.useState<IProduitRupture[]>([]);
  const [pharmacie, setPharmacie] = React.useState<IShop>();
  const [loading, setLoading] = React.useState(true);

  const loadingData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/rapport/rupture_stock", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (result.status === 200) {
        setData(result.data);
        setPharmacie(result.pharmacie);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // En-tête avec les données de la pharmacie
    if (pharmacie) {
      doc.setFontSize(16);
      doc.setFont("Arial", "bold");
      doc.text(pharmacie.shop || "Pharmacie", 14, 20);

      doc.setFontSize(10);
      doc.setFont("Arial", "normal");
      if (pharmacie.adresse) {
        doc.text(`Adresse: ${pharmacie.adresse}`, 14, 30);
      }
      doc.addImage("/logo.png", "PNG", 150, 10, 40, 30);
      if (pharmacie.contact) {
        doc.text(`Contact: ${pharmacie.contact}`, 14, 35);
      }
      if (pharmacie.nif) {
        doc.text(`NIF: ${pharmacie.nif}`, 14, 40);
      }
      if (pharmacie.rccm) {
        doc.text(`RCCM: ${pharmacie.rccm}`, 14, 45);
      }
    }

    // Titre du document
    doc.setFontSize(18);
    doc.setFont("Arial", "bold");
    doc.text("Inventaire Actuel", 14, pharmacie ? 60 : 22);
    doc.setFontSize(12);
    doc.setFont("Arial", "normal");
    doc.text(
      `Généré le: ${new Date().toLocaleDateString("fr-FR")}`,
      14,
      pharmacie ? 70 : 32
    );

    // Préparation des données pour le tableau
    const tableData = data.map((item, key) => [
      key + 1,
      item.designation,
      item.unite,
      item.quantite.toString(),
      item.minimum.toString(),
    ]);

    // Configuration du tableau
    autoTable(doc, {
      head: [
        [
          "ID",
          "Désignation",
          "Unité",
          "Qte",
          "P.A.U",
          "Valeur Achat",
          "P.V.U",
          "Valeur Vente",
        ],
      ],
      body: tableData,
      startY: pharmacie ? 80 : 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.setFontSize(12);
    // Sauvegarde du PDF
    doc.save(
      `produit en rupture de stock du${new Date().toLocaleDateString(
        "fr-FR"
      )}.pdf`
    );
  };

  React.useEffect(() => {
    const initialize = async () => {
      await loadingData();
    };
    initialize();
  }, []);

  return (
    <Header title="Produit en rupture de stock">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Produit en rupture de stock
          </h1>
          <button
            onClick={exportToPDF}
            disabled={loading || data.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exporter PDF
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune donnée disponible</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Désignation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Minimum
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.designation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.unite}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantite}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.minimum}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Header>
  );
}

export default ProduitRuptureStock;
