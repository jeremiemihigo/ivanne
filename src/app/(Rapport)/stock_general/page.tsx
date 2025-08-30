"use client";

import Header from "@/app/Header/Header";
import { IStockRapport } from "@/app/Interfaces/Rapport";
import { IShop } from "@/app/Interfaces/Shop";
import Loading from "@/app/Tools/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";

interface Initiale {
  date1: string;
  date2: string;
}

function StockGeneral() {
  const [data, setData] = React.useState<IStockRapport[]>([]);
  const [load, setLoad] = React.useState<boolean>(false);
  const [initiale, setInitiale] = React.useState<Initiale>({
    date1: "",
    date2: "",
  });
  const loadingData = async () => {
    try {
      const res = await fetch("/api/rapport/stock_general", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initiale),
      });
      const result = await res.json();
      if (result.status === 200) {
        setData(result.data);
        toast(JSON.stringify(`${result.data.length}  resultats trouvés`));
        setLoad(false);
      } else {
        toast(JSON.stringify(result.data));
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [datashop, setDataShop] = React.useState<IShop | null>(null);

  const loadingDataShop = async () => {
    try {
      const res = await fetch("/api/configuration", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (result.status === 200) {
        setDataShop(result.data);
      } else {
        toast(JSON.stringify(result.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingDataShop();
    };
    initialize();
  }, []);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Rapport Stock Général</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 1cm;
              }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .header h1 {
              margin: 0;
              color: #333;
              font-size: 18px;
            }
            .date-range {
              margin-bottom: 20px;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .total-row {
              font-weight: bold;
              background-color: #f9f9f9;
            }
            .no-data {
              text-align: center;
              padding: 20px;
              color: #666;
            }
              .company-header {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
              gap: 20px;
            }
            .company-logo {
              width: 80px;
              height: 80px;
              object-fit: contain;
            }
            .company-info {
              text-align: center;
            }
            .company-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
              color: #333;
            }
            .company-details {
              font-size: 10px;
              color: #666;
              line-height: 1.2;
            }
          </style>
        </head>
        <body>
        <div class="company-header">
             <img src=${
               datashop && datashop.filename ? datashop.filename : "/logo.png"
             } alt="Logo" class="company-logo">
            <div class="company-info">
              <div class="company-name">${datashop && datashop.shop}</div>
              <div class="company-details">
                <div>NIF: ${datashop && datashop?.nif}</div>
                <div>RCCM: ${datashop && datashop?.rccm}</div>
                <div>Adresse: ${datashop && datashop?.adresse}</div>
                <div>Tél: ${datashop && datashop?.contact}</div>
              </div>
            </div>
            <img src=${
              datashop && datashop.filename ? datashop.filename : "/logo.png"
            } alt="Logo" class="company-logo">
          </div>
          <div class="header">
            <h1>RAPPORT STOCK GÉNÉRAL</h1>
          </div>
          <div class="date-range">
            <strong>Période:</strong> Du ${initiale.date1} au ${initiale.date2}
          </div>
          ${
            data.length > 0
              ? `
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Stock Initial</th>
                  <th>Entrées</th>
                  <th>Sorties</th>
                  <th>Solde</th>
                  <th>Prix Unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${data
                  .map(
                    (item, index) => `
                  <tr key=${index}>
                    <td>${item.produit}</td>
                    <td>${item.initiale}</td>
                    <td>${item.entrer}</td>
                    <td>${item.sortie}</td>
                    <td>${item.solde}</td>
                    <td>${item.prix_vente_unitaire}</td>
                    <td>${item.total}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr class="total-row">
                  <td colspan="4"><strong>TOTAL</strong></td>
                  <td><strong>${data.reduce(
                    (sum, item) => sum + item.solde,
                    0
                  )}</strong></td>
                  <td></td>
                  <td><strong>${data.reduce(
                    (sum, item) => sum + item.total,
                    0
                  )}</strong></td>
                </tr>
              </tbody>
            </table>
          `
              : '<div class="no-data">Aucune donnée disponible</div>'
          }
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Header title="Stock général">
      {load ? (
        <Loading />
      ) : (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Filtres de recherche
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Date de début
                </Label>
                <Input
                  type="date"
                  className="w-full"
                  onChange={(e) =>
                    setInitiale({
                      ...initiale,
                      date1: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Date de fin
                </Label>
                <Input
                  type="date"
                  className="w-full"
                  onChange={(e) =>
                    setInitiale({
                      ...initiale,
                      date2: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => loadingData()}
                className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Valider
              </Button>
              {data.length > 0 && (
                <Button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  Imprimer
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Header>
  );
}

export default StockGeneral;
