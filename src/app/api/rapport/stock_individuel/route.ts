import { IStockIndividuel } from "@/app/Interfaces/Rapport";
import { lien } from "@/app/Tools/Lien";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();
    const result = await fetch(`${lien}/stockIndividuel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const response = await result.json();
    if (result.status === 200) {
      const donner: IStockIndividuel[] = response.result;
      const donner1 = donner.map((index) => {
        return {
          ...index,
          date: moment(index.date).format("DD-MM-YYYY"),
        };
      });
      return NextResponse.json({
        data: donner1,
        stock: response.stock,
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
