import { IDetailCaisse } from "@/app/Interfaces/ICaisse";
import { lien } from "@/app/Tools/Lien";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("access")?.value;
    const { id } = await context.params;
    const result = await fetch(`${lien}/detailsCaisse/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();

    if (result.status === 200) {
      const resultat = response.map((item: IDetailCaisse) => {
        return {
          ...item,
          dateSave: moment(item.dateSave).format("DD MMMM YYYY à HH:MM"),
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
