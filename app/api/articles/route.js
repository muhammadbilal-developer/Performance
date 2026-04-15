import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectMongo from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";
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

export async function GET(request) {
  try {
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit") || 10)));
    const search = searchParams.get("q")?.trim();
    const slug = searchParams.get("slug")?.trim();
    const category = searchParams.get("category")?.trim();

    const version = await cacheGetVersion("articles");
    const cacheKey = `articles:v${version}:p${page}:l${limit}:q${search || ""}:slug${slug || ""}:cat${category || ""}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return NextResponse.json(cached);

    const query = {};
    if (slug) query.slug = slug;
    if (search) query.$or = [{ title: { $regex: search, $options: "i" } }, { excerpt: { $regex: search, $options: "i" } }];
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category }).lean();
      if (categoryDoc) query.categoryId = categoryDoc._id;
      else query.category = category;
    }

    const [items, total] = await Promise.all([
      Blog.find(query, { contentSections: 0 })
        .populate("categoryId", "name slug")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query),
    ]);

    const response = {
      items: items.map((item) => ({
        ...item,
        categoryName: item.categoryId?.name || item.category,
        categorySlug: item.categoryId?.slug || toSlug(item.category || ""),
      })),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };

    await cacheSet(cacheKey, response, 120);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch articles.", detail: String(error) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectMongo();
    const body = await request.json();
    const title = body.title?.trim();
    const slug = toSlug(body.slug || body.title || "");
    const categoryId = body.categoryId?.trim();

    if (!title || !slug || !categoryId || !body.headerImage?.url || !body.contentHtml) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const category = await Category.findById(categoryId).lean();
    if (!category) return NextResponse.json({ message: "Invalid category." }, { status: 400 });

    const exists = await Blog.findOne({ slug }).lean();
    if (exists) return NextResponse.json({ message: "Slug already exists." }, { status: 409 });

    const article = await Blog.create({
      title,
      slug,
      excerpt: body.excerpt?.trim() || "",
      category: category.name,
      categoryId: category._id,
      headerImage: body.headerImage,
      logoImage: body.logoImage?.url ? body.logoImage : undefined,
      seo: {
        metaTitle: body.metaTitle?.trim() || title,
        metaDescription: body.metaDescription?.trim() || body.excerpt?.trim() || "",
        keywords: Array.isArray(body.keywords) ? body.keywords : [],
        canonicalUrl: body.canonicalUrl?.trim() || `https://example.com/blog/${slug}`,
      },
      contentHtml: body.contentHtml,
      contentSections: [{ type: "paragraph", text: body.excerpt?.trim() || title }],
    });

    await cacheBumpVersion("articles");
    await cacheBumpVersion("analytics");
    revalidateTag("blogs");
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ message: "Article created.", articleId: String(article._id), slug }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Unable to create article.", detail: String(error) }, { status: 500 });
  }
}
