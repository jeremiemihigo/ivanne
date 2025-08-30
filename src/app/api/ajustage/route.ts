import { IAjustage } from "@/app/Interfaces/IStock";
import { lien } from "@/app/Tools/Lien";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();
    const res = await fetch(`${lien}/addAjustage`, {
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
        data: result,
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
    const result = await fetch(`${lien}/readAjustage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      const donner: IAjustage[] = response;
      const data = donner.map((item) => {
        return {
          ...item,
          Date: moment(item.Date).format("DD MMMM YYYY"),
        };
      });
      return NextResponse.json({
        data,
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
