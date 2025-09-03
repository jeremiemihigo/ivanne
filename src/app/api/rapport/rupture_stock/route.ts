import { IProduitRupture } from "@/app/Interfaces/Rapport";
import { IShop } from "@/app/Interfaces/Shop";
import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const result = await fetch(`${lien}/produitRuptureStock`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      const donner: IProduitRupture[] = response.result;
      const pharmacie: IShop = response.pharmacie;
      return NextResponse.json({
        data: donner,
        pharmacie,
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
