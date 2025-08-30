import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  try {
    const token = request.cookies.get("access")?.value;
    const { type } = await context.params;
    const result = await fetch(`${lien}/readTiers/${type}`, {
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
