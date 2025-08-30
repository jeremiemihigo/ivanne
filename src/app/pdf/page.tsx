"use client";

import { useRef } from "react";
import { usePDF } from "react-to-pdf";

export default function PdfPage() {
  const targetRef = useRef(null);

  // ici tu mets seulement filename et autres options valides
  const { toPDF } = usePDF({ filename: "rapport-notes.pdf" });

  return (
    <div className="flex flex-col items-center p-10 space-y-6 bg-gray-50 min-h-screen">
      {/* Zone exportée */}
      <div
        ref={targetRef}
        className="w-[210mm] min-h-[297mm] bg-white shadow-xl p-10 text-black rounded-xl"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Bulletin scolaire 📚
        </h1>
        <table className="w-full border-collapse border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">Matière</th>
              <th className="border p-2 text-center">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Mathématiques</td>
              <td className="border p-2 text-center">18/20</td>
            </tr>
            <tr>
              <td className="border p-2">Physique</td>
              <td className="border p-2 text-center">16/20</td>
            </tr>
            <tr>
              <td className="border p-2">Informatique</td>
              <td className="border p-2 text-center">19/20</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bouton */}
      <button
        onClick={() => toPDF()} // 👈 targetRef va ici
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Télécharger PDF
      </button>
    </div>
  );
}
