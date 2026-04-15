import { NextResponse } from "next/server";
import { incrementMetric } from "@/lib/redis";

export async function POST() {
  try {
    await incrementMetric("metrics:pageviews");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: "Failed to record view.", detail: String(error) }, { status: 500 });
  }
}
