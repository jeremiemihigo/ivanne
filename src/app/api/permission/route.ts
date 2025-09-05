import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();

    const res = await fetch(`${lien}/permission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ data }),
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
