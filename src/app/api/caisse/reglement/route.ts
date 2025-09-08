import { IReglement } from "@/app/Interfaces/ICaisse";
import { lien } from "@/app/Tools/Lien";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();
    const result = await fetch(`${lien}/addreglement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const response = await result.json();
    if (result.status === 200) {
      const donner: IReglement = response;
      const data = {
        ...donner,
        dateSave: moment(donner.dateSave).format("dddd DD-MM-YYYY"),
      };

      return NextResponse.json({
        data,
        status: 200,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();
    const result = await fetch(`${lien}/deletereglement`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const response = await result.json();
    if (result.status === 200) {
      const donner: IReglement = response;
      const data = {
        ...donner,
        dateSave: moment(donner.dateSave).format("dddd DD-MM-YYYY"),
      };
      return NextResponse.json({
        data,
        status: 200,
      });
    } else {
      return NextResponse.json({
        message: response,
        status: 201,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const result = await fetch(`${lien}/readreglement`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();
    if (result.status === 200) {
      const donner: IReglement[] = response;
      const data = donner.map((index) => {
        return {
          ...index,
          dateSave: moment(index.dateSave).format("dddd DD-MM-YYYY"),
          montant: index.montant + " CDF",
        };
      });
      return NextResponse.json({
        data,
        status: 200,
      });
    } else {
      return NextResponse.json({
        message: response,
        status: 201,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
