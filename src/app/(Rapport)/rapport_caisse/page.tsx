"use client";

import Header from "@/app/Header/Header";
import { IRapportCaisse } from "@/app/Interfaces/Rapport";
import { IShop } from "@/app/Interfaces/Shop";
import Loading from "@/app/Tools/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { toast } from "sonner";

interface Initiale {
  date1: string;
  date2: string;
}

function StockGeneral() {
  const [data, setData] = React.useState<IRapportCaisse | null>(null);
  const [load, setLoad] = React.useState<boolean>(false);
  const [initiale, setInitiale] = React.useState<Initiale>({
    date1: "",
    date2: "",
  });
  const loadingData = async () => {
    setLoad(true);
    try {
      const res = await fetch("/api/rapport/rapport_caisse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initiale),
      });
      const result = await res.json();
      console.log(result);
      if (result.status === 200) {
        setData(result.data);
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
  // Ajout du tableau de synthèse dans le contenu imprimé
  // On suppose que "data" est l'état contenant le rapport chargé

  // Fonction utilitaire pour formatter les montants
  function formatNumber(num: number) {
    return (
      num?.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) ?? "-"
    );
  }

  const generatePrintContent = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport Stock Individuel</title>
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
            font-size: 14px;
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
            font-weight: normal;
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
            .text-center{
            text-align:center;
            }
            .text-red{
            color:red;
            }
            .title{
            font-weight: bolder;
            font-size:15px;}
        </style>
      </head>
      <body>
        <div class="company-header">
          <img src="${
            datashop?.filename || "/logo.png"
          }" alt="Logo" class="company-logo">
          <div class="company-info">
            <div class="company-name">${datashop?.shop || ""}</div>
            <div class="company-details">
              <div>NIF: ${datashop?.nif || ""}</div>
              <div>RCCM: ${datashop?.rccm || ""}</div>
              <div>Adresse: ${datashop?.adresse || ""}</div>
              <div>Tél: ${datashop?.contact || ""}</div>
            </div>
          </div>
          <img src="${
            datashop?.filename || "/logo.png"
          }" alt="Logo" class="company-logo">
        </div>
        
        <div class="header">
          <h1>RAPPORT DE CAISSE</h1>
        </div>

        
        <div class="date-range">
          <p class="text-center"><strong>Période:</strong> Du ${
            initiale.date1
          } au ${initiale.date2}</p>
        </div>
        
        ${
          data
            ? `
            <p class="title">Ventes</p>
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.ventes
                .map(
                  (item, index) => `
                  <tr key="${index}">
                  <td>${item.client}</td>
                 
                  <td>${formatNumber(item.total)} CDF</td>
                 
                </tr>
                
              `,
                )
                .join("")}
              <tr class="total-row">
                <td ><strong>Total</strong></td>
                <td><strong>${formatNumber(
                  _.sumBy(data.ventes, "total"),
                )}CDF</strong></td>
              </tr>
            </tbody>
          </table>
           <p class="title">Sorties</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Motif</th>
                <th>Montant</th>
                <th>Enregistrer par</th>
              </tr>
            </thead>
            <tbody>
              ${data.depenses
                .map(
                  (item, index) => `
                  <tr key="${index}">
                  <td>${moment(item.dateSave).format("DD-MM-YYYY")}</td>
                 
                  <td>${item.motif}</td>
                  <td>${formatNumber(item.montant)} CDF</td>
                  <td>${item.doby}</td>
                 
                </tr>
                
              `,
                )
                .join("")}
              <tr class="total-row">
                <td colspan="2" ><strong>Total</strong></td>
                <td colspan="2"><strong>${formatNumber(
                  _.sumBy(data.depenses, "montant"),
                )} CDF</strong></td>
                
              </tr>
            </tbody>
          </table>
           <p class="title">Autres encaissement</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Motif</th>
                <th>Provenance</th>
                <th>Montant USD</th>
                <th>Montant CDF</th>
                <th>Enregistrer par</th>
              </tr>
            </thead>
            <tbody>
              ${data.entrer
                .map(
                  (item, index) => `
                  <tr key="${index}">
                  <td>${moment(item.dateSave).format("DD-MM-YYYY")}</td>
                 
                  <td>${item.motif}</td>
                  <td>${item.provenance}</td>
                  <td>${
                    item.devise === "USD" ? formatNumber(item.montant) : ""
                  }</td>
                  <td>${
                    item.devise === "CDF" ? formatNumber(item.montant) : ""
                  }</td>
                  <td>${item.saved_by}</td>
                 
                </tr>
                
              `,
                )
                .join("")}
              <tr class="total-row">
                <td colspan="3"><strong>Total</strong></td>
                <td><strong>${formatNumber(
                  _.sumBy(_.filter(data.entrer, { devise: "USD" }), "montant"),
                )}</strong></td>
                <td><strong>${formatNumber(
                  _.sumBy(_.filter(data.entrer, { devise: "CDF" }), "montant"),
                )}</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>
           <p className="title">Synthese</p>
          <table>
            <thead>
              <tr>
                <th>SOLDE CDF</th>
                <th>${formatNumber(
                  _.sumBy(data.ventes, "total") +
                    _.sumBy(
                      _.filter(data?.entrer, { devise: "CDF" }),
                      "montant",
                    ) -
                    _.sumBy(data.depenses, "montant"),
                )}</th>
               
              </tr>
              <tr>
                <th>SOLDE USD</th>
                <th>${formatNumber(
                  _.sumBy(_.filter(data?.entrer, { devise: "USD" }), "montant"),
                )}</th>
               
              </tr>
            </thead>
            
          </table>
        `
            : '<div class="no-data">Aucune donnée disponible</div>'
        }
      </body>
      </html>
    `;
  };
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(generatePrintContent());
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Header title="Rapport de caisse">
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
              {data && (
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
