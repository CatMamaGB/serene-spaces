import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/gmail-oauth";

export async function GET() {
  try {
    const url = getAuthUrl(); // uses access_type=offline & prompt=consent
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate authorization URL" },
      { status: 500 },
    );
  }
}
