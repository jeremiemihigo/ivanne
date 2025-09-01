"use client";
import React from "react";
import Header from "./Header/Header";

interface IData {
  nombreProduits: number;
  chiffre_affaire: number;
  creance: number;
  depense: number;
  plus_vendu: string;
  plus_rentable: string;
  produit_non_disponible_en_stock: number;
  produit_pre_peremption: number;
}
interface IDataGraphique {
  month: string;
  montant_vendu: number;
}

// Composant pour le graphique des ventes
const SalesChart = ({ data }: { data: IDataGraphique[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Évolution des Ventes par Mois
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Aucune donnée de vente disponible
        </div>
      </div>
    );
  }

  const maxAmount = Math.max(...data.map((item) => item.montant_vendu));
  const minAmount = Math.min(...data.map((item) => item.montant_vendu));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Évolution des Ventes par Mois
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage =
            maxAmount > 0 ? (item.montant_vendu / maxAmount) * 100 : 0;
          const isIncreasing =
            index > 0
              ? item.montant_vendu > data[index - 1].montant_vendu
              : null;

          return (
            <div key={item.month} className="flex items-center space-x-4">
              <div className="w-20 text-sm font-medium text-gray-600">
                {item.month}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-sm font-semibold text-gray-900">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "USD",
                    }).format(item.montant_vendu)}
                  </div>
                  {index > 0 && (
                    <div className="w-8 flex justify-center">
                      {isIncreasing ? (
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Minimum:{" "}
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "USD",
            }).format(minAmount)}
          </span>
          <span>
            Maximum:{" "}
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "USD",
            }).format(maxAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

interface IJournalier {
  payer: number;
  creance: number;
  depense: number;
}

export default function Page() {
  const [data, setData] = React.useState<IData>();
  const [ventes, setVentes] = React.useState<IDataGraphique[]>();
  const [journalier, setJournalier] = React.useState<IJournalier>();
  const [load, setload] = React.useState<boolean>(true);

  const loadingData = async () => {
    try {
      const res = await fetch("/api/dashboard/syntheseData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();

      setData(response.data.information);
      setVentes(response.data.ventes);
    } catch (error) {
      console.log(error);
      setload(false);
    }
  };
  const loadingDataJournalier = async () => {
    try {
      const res = await fetch("/api/dashboard/rapportjournalier", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      console.log(response);
      setJournalier(response.data);
    } catch (error) {
      console.log(error);
      setload(false);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingData();
      await loadingDataJournalier();
      setload(false);
    };
    initialize();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(amount);
  };

  if (load) {
    return (
      <Header title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Header>
    );
  }

  return (
    <Header title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {/* Nombre de Produits */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Nombre de Produits
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {data?.nombreProduits || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Chiffre d'Affaires */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Chiffre d&apos;Affaires
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(data?.chiffre_affaire || 0, "USD")}
              </p>
            </div>
          </div>
        </div>

        {/* Créances */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Créances</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(data?.creance || 0, "CDF")}
              </p>
            </div>
          </div>
        </div>

        {/* Dépenses */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dépenses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(data?.depense || 0, "USD")}
              </p>
            </div>
          </div>
        </div>

        {/* Produit le Plus Vendu */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Produit le Plus Vendu
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {data?.plus_vendu || "Aucun produit"}
              </p>
            </div>
          </div>
        </div>

        {/* Produit le Plus Rentable */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Produit le Plus Rentable
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {data?.plus_rentable || "Aucun produit"}
              </p>
            </div>
          </div>
        </div>

        {/* Produits Non Disponibles en Stock */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Produits Non Disponibles
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {data?.produit_non_disponible_en_stock || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Produits en Pré-Péremption */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100">
              <svg
                className="w-6 h-6 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Produits en Pré-Péremption
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {data?.produit_pre_peremption || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p style={{ fontSize: "25px", textAlign: "center" }} className="text-lg">
        Rapport journalier
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {/* Nombre de Produits */}

        {/* Chiffre d'Affaires */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(journalier?.payer || 0, "CDF")}
              </p>
            </div>
          </div>
        </div>

        {/* Créances */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Créances</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(journalier?.creance || 0, "CDF")}
              </p>
            </div>
          </div>
        </div>

        {/* Dépenses */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dépenses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(journalier?.depense || 0, "CDF")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <SalesChart data={ventes || []} />
    </Header>
  );
}
