import { unstable_cache } from "next/cache";
import connectMongo from "./mongodb";
import Blog from "./models/Blog";

async function fetchBlogListFromDb() {
  await connectMongo();
  return Blog.find(
    {},
    { _id: 0, slug: 1, title: 1, excerpt: 1, category: 1, categoryId: 1, headerImage: 1, seo: 1, createdAt: 1 }
  )
    .populate("categoryId", "name slug")
    .sort({ createdAt: -1 })
    .lean();
}

const getCachedBlogList = unstable_cache(fetchBlogListFromDb, ["blogs-list"], {
  revalidate: 3600,
  tags: ["blogs"],
});

export async function getBlogs() {
  return getCachedBlogList();
}

export async function getBlogBySlug(slug) {
  const getCachedBlog = unstable_cache(
    async () => {
      await connectMongo();
      return Blog.findOne({ slug }, { _id: 0 }).populate("categoryId", "name slug").lean();
    },
    ["blog-by-slug", slug],
    {
      revalidate: 3600,
      tags: ["blogs"],
    }
  );

  return getCachedBlog();
}
