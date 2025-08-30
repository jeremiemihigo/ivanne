import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();
    const res = await fetch(`${lien}/addFournisseurClient`, {
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
