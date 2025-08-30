import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const result = await fetch(`${lien}/readshop`, {
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
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const donner = await request.json();
    const result = await fetch(`${lien}/UpdateInfoShop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(donner),
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
