import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const token = request.cookies.get("access")?.value;

    const res = await fetch(`${lien}/readOneUser/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const result = await res.json();
    const reponse = NextResponse.json({
      data: result,
      status: res.status,
    });
    return reponse;
  } catch (error) {
    console.log(error);
  }
}
