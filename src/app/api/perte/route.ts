import { IPerte } from "@/app/Interfaces/IOther";
import { lien } from "@/app/Tools/Lien";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();

    const res = await fetch(`${lien}/addPerte`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (res.status === 200) {
      const donner = {
        ...result[0],
        date: moment(result.date).format("dddd DD-MM-YYYY"),
      };
      const reponse = NextResponse.json({
        data: donner,
        status: 200,
      });
      return reponse;
    } else {
      const reponse = NextResponse.json({
        message: result,
        status: 201,
      });
      return reponse;
    }
  } catch (error) {
    console.log(error);
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const data = await request.json();

    const res = await fetch(`${lien}/deletePerte`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.status === 200) {
      const donner = {
        ...result[0],
        date: moment(result.date).format("dddd DD-MM-YYYY"),
      };
      const reponse = NextResponse.json({
        data: donner,
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
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access")?.value;
    const result = await fetch(`${lien}/readPerte`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();
    console.log(response);
    if (result.status === 200) {
      const donner = response.map((index: IPerte) => {
        return {
          ...index,
          date: moment(index.date).format("dddd DD-MM-YYYY"),
        };
      });

      const data = NextResponse.json({
        data: donner,
        status: 200,
      });
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}
