import { NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/redis";

const SETTINGS_KEY = "settings:site";

export async function GET() {
  try {
    const settings = (await cacheGet(SETTINGS_KEY)) || {};
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch settings.", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const settings = {
      logoUrl: body.logoUrl || "",
      logoAlt: body.logoAlt || "Site logo",
    };
    await cacheSet(SETTINGS_KEY, settings, 60 * 60 * 24 * 30);
    return NextResponse.json({ message: "Settings updated.", settings });
  } catch (error) {
    return NextResponse.json({ message: "Failed to save settings.", detail: String(error) }, { status: 500 });
  }
}
