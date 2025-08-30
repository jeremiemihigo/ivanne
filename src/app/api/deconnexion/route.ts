import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({
    message: "Déconnexion réussie",
    status: 200,
  });
  // Supprimer le cookie "access" en le réécrivant avec expiration dans le passé
  response.cookies.set({
    name: "access",
    value: "",
    path: "/",
    expires: new Date(0), // ✅ Date expirée
    httpOnly: true, // facultatif, selon comment tu l’as défini
  });

  return response;
}
