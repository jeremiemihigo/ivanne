import { IApprovisionnement } from "@/app/Interfaces/IApprovisionnement";
import { lien } from "@/app/Tools/Lien";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();

    const res = await fetch(`${lien}/addapprovisionnement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log(result);
    if (res.status === 200) {
      const reponse = NextResponse.json({
        message: "Done",
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
    const result = await fetch(`${lien}/readApprovisionnement`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response: IApprovisionnement[] = await result.json();

    if (result.status === 200) {
      const resultat = response.map((item) => {
        return {
          ...item,
          date_peremption: moment(item.date_peremption).format("DD MMMM YYYY"),
          dateFabrication: moment(item.dateFabrication).format("DD MMMM YYYY"),
          dateSave: moment(item.dateSave).format("DD MMMM YYYY"),
        };
      });
      return NextResponse.json({
        data: resultat,
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
