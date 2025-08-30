import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const identiant = await request.json();
  const token = request.cookies.get("access")?.value;
  const link = `${lien}/updatePassword`;
  const res = await fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(identiant),
  });
  const response = NextResponse.json({
    data: res.status,
  });
  return response;
}
