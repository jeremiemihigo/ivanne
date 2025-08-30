import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const result = await fetch(`${lien}/syntheseData`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      const data = NextResponse.json({
        data: response,
        status: 200,
      });
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}
