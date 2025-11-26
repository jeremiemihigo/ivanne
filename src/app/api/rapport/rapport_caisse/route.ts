import { lien } from "@/app/Tools/Lien";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();
    const result = await fetch(`${lien}/rapportCaisse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const response = await result.json();
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
