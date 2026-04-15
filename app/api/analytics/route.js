import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";
import Category from "@/lib/models/Category";
import { cacheGet, cacheGetVersion, cacheSet, readMetric } from "@/lib/redis";

export async function GET() {
  try {
    await connectMongo();
    const version = await cacheGetVersion("analytics");
    const cacheKey = `analytics:v${version}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return NextResponse.json(cached);

    const [totalArticles, totalCategories, recentArticles, pageViews] = await Promise.all([
      Blog.countDocuments(),
      Category.countDocuments(),
      Blog.find({}, { title: 1, slug: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(5).lean(),
      readMetric("metrics:pageviews"),
    ]);

    const topCategoriesAgg = await Blog.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const response = {
      totalArticles,
      totalCategories,
      pageViews,
      topCategories: topCategoriesAgg,
      recentArticles,
    };
    await cacheSet(cacheKey, response, 60);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch analytics.", detail: String(error) }, { status: 500 });
  }
}
