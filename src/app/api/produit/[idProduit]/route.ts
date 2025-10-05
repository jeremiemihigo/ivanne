import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

type TDonner = {
  quantite: number;
  prix_achat: number;
  prix_vente: number;
  information: string;
  fonction: string;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ idProduit: string }> }
) {
  try {
    const token = request.cookies.get("access")?.value;
    const { idProduit } = await context.params;
    const result = await fetch(`${lien}/stockproduit/${idProduit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      const donner: TDonner = response;
      return NextResponse.json({
        data: donner,
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
