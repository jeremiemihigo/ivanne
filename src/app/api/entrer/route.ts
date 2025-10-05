import { IEntrer } from "@/app/Interfaces/IOther";
import { lien } from "@/app/Tools/Lien";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();

    const res = await fetch(`${lien}/ajouterEntrer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.status === 200) {
      const donner = {
        ...result,
        dateSave: moment(result.dateSave).format("dddd DD-MM-YYYY"),
        montant: result.montant + " CDF",
      };
      const reponse = NextResponse.json({
        data: donner,
        status: 200,
      });
      return reponse;
    } else {
      const reponse = NextResponse.json({
        message: result,
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
    const result = await fetch(`${lien}/readEntrer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      const donner = response.map((index: IEntrer) => {
        return {
          ...index,
          dateSave: moment(index.dateSave).format("dddd DD-MM-YYYY"),
          montant: index.montant + " " + index.devise,
        };
      });

      const data = NextResponse.json({
        data: donner,
        status: 200,
      });
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}
