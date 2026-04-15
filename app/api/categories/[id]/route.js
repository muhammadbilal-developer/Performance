import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import Blog from "@/lib/models/Blog";
import { cacheBumpVersion } from "@/lib/redis";

function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function PATCH(request, { params }) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();
    const name = body.name?.trim();
    const updatePayload = {};
    if (name) {
      updatePayload.name = name;
      updatePayload.slug = toSlug(body.slug || name);
    }
    if (typeof body.description === "string") {
      updatePayload.description = body.description;
    }
    const category = await Category.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
    if (!category) return NextResponse.json({ message: "Category not found." }, { status: 404 });

    if (name) {
      await Blog.updateMany({ categoryId: id }, { category: name });
    }

    await cacheBumpVersion("categories");
    await cacheBumpVersion("articles");
    await cacheBumpVersion("analytics");
    return NextResponse.json({ message: "Category updated.", category });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update category.", detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectMongo();
    const { id } = await params;
    const linkedArticles = await Blog.countDocuments({ categoryId: id });
    if (linkedArticles > 0) {
      return NextResponse.json(
        { message: "Category has linked articles. Reassign or delete those first." },
        { status: 400 }
      );
    }

    const deleted = await Category.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ message: "Category not found." }, { status: 404 });

    await cacheBumpVersion("categories");
    await cacheBumpVersion("analytics");
    return NextResponse.json({ message: "Category deleted." });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete category.", detail: String(error) }, { status: 500 });
  }
}
