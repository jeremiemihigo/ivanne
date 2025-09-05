import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  const identiant = await request.json();
  const link = `${lien}/login`;
  const res = await fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(identiant),
  });

  const data = await res.json();

  if (res.status === 200) {
    const response = NextResponse.json({
      message: "success",
    });
    response.cookies.set("access", data.token, {
      httpOnly: true, // inaccessible en JS (protège contre XSS)
      secure: true, // envoie seulement over HTTPS
      sameSite: "lax", // ou "strict" selon UX, évite envois cross-site involontaires
      path: "/", // domaine entier
      maxAge: 7 * 24 * 60 * 60, // en secondes (ici 7 jours)
    });
    return response;
  } else {
    return NextResponse.json({
      message: data,
    });
  }

  // const data = await res.json();
  // return new Response(JSON.stringify({ status: res.status, data }), {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   status: res.status,
  // });
}
//Lecture de l'agent
export async function GET(request: NextRequest) {
  const token = request.cookies.get("access")?.value;

  if (!token) {
    const response = NextResponse.json({
      data: "logout",
      status: 201,
    });
    return response;
  } else {
    const link = `${lien}/readuser`;
    const res = await fetch(link, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: "Bearer " + token,
      },
    });

    const reponse = await res.json();
    const response = NextResponse.json({
      data: reponse,
      status: res.status,
    });
    return response;
  }
}
