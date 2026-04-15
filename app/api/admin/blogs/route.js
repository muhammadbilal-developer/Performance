import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";
import { revalidatePath, revalidateTag } from "next/cache";

function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const title = body.title?.trim();
    const slug = toSlug(body.slug || body.title || "");

    if (!title || !slug || !body.headerImage?.url || !body.contentHtml) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    await connectMongo();

    const exists = await Blog.findOne({ slug }).lean();
    if (exists) {
      return NextResponse.json({ message: "Slug already exists." }, { status: 409 });
    }

    const blog = await Blog.create({
      title,
      slug,
      excerpt: body.excerpt?.trim() || "",
      category: body.category?.trim() || "VAT Calculator",
      headerImage: body.headerImage,
      seo: {
        metaTitle: body.metaTitle?.trim() || title,
        metaDescription: body.metaDescription?.trim() || body.excerpt?.trim() || "",
        keywords: Array.isArray(body.keywords) ? body.keywords : [],
        canonicalUrl: body.canonicalUrl?.trim() || `https://example.com/blog/${slug}`,
      },
      contentHtml: body.contentHtml,
      contentSections: [{ type: "paragraph", text: body.excerpt?.trim() || title }],
    });

    revalidateTag("blogs");
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ message: "Blog created.", slug: blog.slug }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Unable to create blog.", detail: String(error) }, { status: 500 });
  }
}
