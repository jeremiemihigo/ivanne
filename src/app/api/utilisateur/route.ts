import { IUser } from "@/app/Interfaces/IUser";
import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();

    const res = await fetch(`${lien}/adduser`, {
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
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const result = await fetch(`${lien}/readalluser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      const formating = response.map((index: IUser) => {
        return {
          ...index,
          actif: index.actif ? "Actif" : "Bloquer",
        };
      });
      const data = NextResponse.json({
        data: formating,
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
    const data = await request.json();
    const result = await fetch(`${lien}/bloqueruserorunbloquer`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ data }),
    });
    const response = await result.json();
    if (result.status === 200) {
      const data = NextResponse.json({
        data: response.data,
        status: 200,
      });
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}
