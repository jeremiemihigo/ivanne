import { IFacture } from "@/app/Interfaces/IFacture";
import { IShop } from "@/app/Interfaces/Shop";

type Props = {
  data: IFacture[];
  shop: IShop;
};
function Facture({ data, shop }: Props) {
  return (
    <article className="page bg-white rounded-2xl shadow-2xl no-print-shadow p-8 sm:p-12 mb-10 print:rounded-none print:shadow-none max-w-4xl mx-auto print:h-screen print:overflow-hidden ">
      {/* Header Section */}
      <section className="border-b-4 border-[#00A651] pb-6 mb-6 print:pb-4 print:mb-4 print:flex-shrink-0">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-3 print:mb-2">
              <div className="w-10 h-10 bg-[#00A651] rounded-full flex items-center justify-center mr-3 print:w-8 print:h-8">
                <span className="text-white font-bold text-lg print:text-base">
                  SP
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 mb-1 print:text-lg">
                  {shop.shop}
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs print:text-xs text-gray-600">
              <div>
                <p className="mb-1">
                  <span className="font-semibold">NIF:</span> {shop?.nif}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">RCCM:</span> {shop?.rccm}
                </p>
              </div>
              <div>
                <p className="mb-1">
                  <span className="font-semibold">Adresse:</span>{" "}
                  {shop?.adresse}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Tél:</span> {shop?.contact}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right ml-6 print:ml-4">
            <div className="bg-[#00A651] text-white p-3 rounded-lg print:p-2">
              <h2 className="text-lg font-bold mb-1 print:text-base">
                FACTURE N° {data[0].idFacture}
              </h2>
              <p className="text-xs opacity-90 print:text-xs">
                Date: {new Date(data[0].dateSave).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="mt-3 p-2 bg-gray-50 rounded-lg print:mt-2 print:p-2">
              <p className="text-xs text-gray-600 mb-1">Client:</p>
              <p className="font-semibold text-gray-800 print:text-sm">
                {data[0].client}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Table */}
      <section className="mb-4 print:flex-1 print:overflow-hidden">
        <h3 className="text-base font-semibold text-gray-800 mb-3 print:mb-2 flex items-center print:text-sm">
          <span className="w-2 h-2 bg-[#00A651] rounded-full mr-2 print:mr-2"></span>
          Détails des Produits
        </h3>
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse print:text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-[#00A651] to-[#008f45] text-white">
                <th className="border border-[#00A651] px-2 py-2 text-left font-semibold print:px-1 print:py-1">
                  #
                </th>
                <th className="border border-[#00A651] px-2 py-2 text-left font-semibold print:px-1 print:py-1">
                  Produit
                </th>
                <th className="border border-[#00A651] px-2 py-2 text-center font-semibold print:px-1 print:py-1">
                  Qté
                </th>
                <th className="border border-[#00A651] px-2 py-2 text-center font-semibold print:px-1 print:py-1">
                  P.U
                </th>
                <th className="border border-[#00A651] px-2 py-2 text-right font-semibold print:px-1 print:py-1">
                  A payer
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 &&
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-green-50 transition-colors print:hover:bg-transparent"
                  >
                    <td className="border border-gray-200 px-2 py-2 text-gray-700 font-medium print:px-1 print:py-1">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-2 py-2 text-gray-700 print:px-1 print:py-1">
                      {item.produit}
                    </td>

                    <td className="border border-gray-200 px-2 py-2 text-center text-gray-700 font-medium print:px-1 print:py-1">
                      {item.quantite}
                    </td>
                    <td className="border border-gray-200 px-2 py-2 text-gray-700 print:px-1 print:py-1">
                      {item.pu.toLocaleString()} CDF
                    </td>
                    <td className="border border-gray-200 px-2 py-2 text-right text-gray-700 font-semibold print:px-1 print:py-1">
                      {item.pu * item.quantite} CDF
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Summary Section */}
      <section className="mb-6 print:mb-4 print:flex-shrink-0 print:block">
        <div className="flex justify-end print:justify-end">
          <div className="w-80 print:w-72 print:block">
            <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-lg border border-gray-200 print:p-3 print:bg-white print:border-2 print:border-gray-300">
              <h3 className="text-base font-semibold text-gray-800 mb-3 print:mb-2 flex items-center print:text-sm">
                <span className="w-2 h-2 bg-[#00A651] rounded-full mr-2 print:mr-2"></span>
                Résumé de la Facture
              </h3>
              <table className="w-full print:text-xs print:border-collapse">
                <tbody>
                  <tr className="border-b border-gray-200 print:border-b-2 print:border-gray-400">
                    <td className="py-2 text-gray-700 font-medium print:py-1">
                      Prix de vente total:
                    </td>
                    <td className="py-2 text-right text-gray-700 font-semibold print:py-1">
                      {data[0].prix_vente}
                      CDF
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 print:border-b-2 print:border-gray-400">
                    <td className="py-2 text-gray-700 font-medium print:py-1">
                      Total payé:
                    </td>
                    <td className="py-2 text-right text-green-600 font-semibold print:py-1">
                      {data[0].payer.toLocaleString()} CDF
                    </td>
                  </tr>
                  <tr className="bg-[#00A651] text-white">
                    <td className="py-3 font-bold text-base print:py-2 print:text-sm print:border-b-2 print:border-gray-600">
                      Reste à payer:
                    </td>
                    <td className="py-3 text-right font-bold text-base print:py-2 print:text-sm print:border-b-2 print:border-gray-600">
                      {Math.max(
                        0,
                        data[0].prix_vente - data[0].payer
                      ).toLocaleString()}{" "}
                      CDF
                    </td>
                  </tr>
                  <tr className="border-t-2 border-gray-300 print:border-t-2 print:border-gray-600">
                    <td className="py-3 font-bold text-base print:py-2 print:text-sm">
                      Statut:
                    </td>
                    <td className="py-3 text-right font-bold text-base print:py-2 print:text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          Math.max(0, data[0].prix_vente - data[0].payer) === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {Math.max(0, data[0].prix_vente - data[0].payer) === 0
                          ? "SOLDE"
                          : "NON SOLDE"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Person who performed the registration */}
      <section className="mt-6 print:mt-4 print:flex-shrink-0">
        <div className="flex justify-end">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 print:bg-white print:border-2 print:border-gray-300 print:p-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 print:w-6 print:h-6">
                <svg
                  className="w-4 h-4 text-white print:w-3 print:h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1 print:text-xs">
                  Enregistré par:
                </p>
                <p className="font-semibold text-gray-800 print:text-sm">
                  {data[0].doby}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <p>Merci pour votre confiance !</p>
      </section>
      {/* Footer */}
    </article>
  );
}

export default Facture;
