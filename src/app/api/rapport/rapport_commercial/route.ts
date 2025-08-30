import { IRapportCommerciale } from "@/app/Interfaces/Rapport";
import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();
    const result = await fetch(`${lien}/rapportCommercial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const response = await result.json();
    if (result.status === 200) {
      const donner: IRapportCommerciale[] = response;
      return NextResponse.json({
        data: donner,
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
