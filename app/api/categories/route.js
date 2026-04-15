import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import { cacheBumpVersion, cacheGet, cacheGetVersion, cacheSet } from "@/lib/redis";

function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    await connectMongo();
    const version = await cacheGetVersion("categories");
    const cacheKey = `categories:v${version}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return NextResponse.json(cached);

    const items = await Category.find({}).sort({ name: 1 }).lean();
    const response = { items };
    await cacheSet(cacheKey, response, 300);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch categories.", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectMongo();
    const body = await request.json();
    const name = body.name?.trim();
    if (!name) return NextResponse.json({ message: "Category name is required." }, { status: 400 });
    const slug = toSlug(body.slug || name);
    if (!slug) return NextResponse.json({ message: "Invalid category name." }, { status: 400 });
    const exists = await Category.findOne({ $or: [{ name }, { slug }] }).lean();
    if (exists) return NextResponse.json({ message: "Category already exists." }, { status: 409 });

    const category = await Category.create({
      name,
      slug,
      description: body.description?.trim() || "",
    });
    await cacheBumpVersion("categories");
    await cacheBumpVersion("analytics");
    return NextResponse.json({ message: "Category created.", category }, { status: 201 });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json({ message: "Category already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Failed to create category.", detail: String(error) }, { status: 500 });
  }
}
