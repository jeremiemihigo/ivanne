import { lien } from "@/app/Tools/Lien";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("access")?.value;
    const { id } = await context.params;
    const result = await fetch(`${lien}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const response = await result.json();
    return NextResponse.json({
      data: response,
      status: result.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
