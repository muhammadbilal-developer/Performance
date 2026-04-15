import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectMongo from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";
import Category from "@/lib/models/Category";
import { cacheBumpVersion } from "@/lib/redis";

export async function GET(_request, { params }) {
  try {
    await connectMongo();
    const { id } = await params;
    const article = await Blog.findById(id).populate("categoryId", "name slug").lean();
    if (!article) return NextResponse.json({ message: "Article not found." }, { status: 404 });
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch article.", detail: String(error) }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectMongo();
    const { id } = await params;
    const body = await request.json();

    let categoryName;
    if (body.categoryId) {
      const category = await Category.findById(body.categoryId).lean();
      if (!category) return NextResponse.json({ message: "Invalid category." }, { status: 400 });
      categoryName = category.name;
    }

    const updatePayload = {
      ...(body.title ? { title: body.title } : {}),
      ...(body.slug ? { slug: body.slug } : {}),
      ...(body.excerpt ? { excerpt: body.excerpt } : {}),
      ...(body.contentHtml ? { contentHtml: body.contentHtml } : {}),
      ...(body.categoryId ? { categoryId: body.categoryId, category: categoryName } : {}),
      ...(body.headerImage?.url ? { headerImage: body.headerImage } : {}),
      ...(body.logoImage?.url ? { logoImage: body.logoImage } : {}),
    };

    if (body.metaTitle || body.metaDescription || body.canonicalUrl || body.keywords) {
      updatePayload.seo = {
        metaTitle: body.metaTitle || "",
        metaDescription: body.metaDescription || "",
        canonicalUrl: body.canonicalUrl || "",
        keywords: Array.isArray(body.keywords) ? body.keywords : [],
      };
    }

    const article = await Blog.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
    if (!article) return NextResponse.json({ message: "Article not found." }, { status: 404 });

    await cacheBumpVersion("articles");
    await cacheBumpVersion("analytics");
    revalidateTag("blogs");
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${article.slug}`);
    return NextResponse.json({ message: "Article updated.", article });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update article.", detail: String(error) }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectMongo();
    const { id } = await params;
    const article = await Blog.findByIdAndDelete(id).lean();
    if (!article) return NextResponse.json({ message: "Article not found." }, { status: 404 });

    await cacheBumpVersion("articles");
    await cacheBumpVersion("analytics");
    revalidateTag("blogs");
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${article.slug}`);
    return NextResponse.json({ message: "Article deleted." });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete article.", detail: String(error) }, { status: 500 });
  }
}
