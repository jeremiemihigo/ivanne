import { IFacture } from "@/app/Interfaces/IFacture";
import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const result = await fetch(`${lien}/readFacture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      const donner: IFacture[] = response;
      return NextResponse.json({
        data: donner,
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();
    const result = await fetch(`${lien}/deletefacture`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const response = await result.json();
    if (result.status === 200) {
      const donner: IFacture = response;
      return NextResponse.json({
        data: donner,
        status: 200,
      });
    } else {
      return NextResponse.json({
        data: response,
        status: 201,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
