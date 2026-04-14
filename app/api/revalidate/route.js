import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const secret = request.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const slug = body?.slug;

  revalidateTag("blogs");
  revalidatePath("/");
  revalidatePath("/blog");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }

  return NextResponse.json({
    revalidated: true,
    scope: slug ? `blog/${slug}` : "all-blogs",
  });
}
