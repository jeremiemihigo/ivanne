import { ICaisse } from "@/app/Interfaces/ICaisse";
import { lien } from "@/app/Tools/Lien";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();

    const res = await fetch(`${lien}/addCaisse`, {
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
    const result = await fetch(`${lien}/readCaisses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();

    if (result.status === 200) {
      const resultat = response.map((item: ICaisse) => {
        return {
          ...item,
          updatedAt: moment(item.updatedAt).format("DD MMMM YYYY"),
        };
      });
      return NextResponse.json({
        data: resultat,
        status: 200,
      });
    } else {
      return NextResponse.json({
        message: response,
        status: 201,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
