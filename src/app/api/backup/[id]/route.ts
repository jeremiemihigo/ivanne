import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("access")?.value;
  const { id } = await context.params;

  const link = `${lien}/${id}`;
  const res = await fetch(link, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  const result = await res.json();
  const response = NextResponse.json({
    data: result,
    status: result.status,
  });
  return response;
}
