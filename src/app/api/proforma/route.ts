import { IProformaListe } from "@/app/Interfaces/IFacture";
import { lien } from "@/app/Tools/Lien";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();

    const res = await fetch(`${lien}/addproforma`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.status === 200) {
      const reponse = NextResponse.json({
        data: result,
        status: 200,
      });
      return reponse;
    } else {
      const reponse = NextResponse.json({
        message: result.data,
        status: 201,
      });
      return reponse;
    }
  } catch (error) {
    console.log(error);
  }
}
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const res = await fetch(`${lien}/readproforma`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const result = await res.json();
    if (res.status === 200) {
      const formating = result.map((index: IProformaListe) => {
        return {
          ...index,
          date: moment(index.dateSave).format("dddd DD-MM-YYYY"),
          prix_vente: index.prix_vente + " CDF",
          considerer: index.considerer ? "Approuvée" : "En attente",
        };
      });
      const reponse = NextResponse.json({
        data: formating,
        status: 200,
      });
      return reponse;
    } else {
      const reponse = NextResponse.json({
        message: result.data,
        status: 201,
      });
      return reponse;
    }
  } catch (error) {
    console.log(error);
  }
}
