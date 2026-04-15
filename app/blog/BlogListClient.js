"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useArticles } from "@/lib/api/hooks";
import BlogSkeletonGrid from "./BlogSkeletonGrid";

const PAGE_SIZE = 6;

export default function BlogListClient() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const q = searchParams.get("q") || "";
  const currentPage = Number.isNaN(page) ? 1 : Math.max(1, page);
  const { data, isLoading } = useArticles({
    page: currentPage,
    limit: PAGE_SIZE,
    q,
  });

  if (isLoading) {
    return <BlogSkeletonGrid />;
  }

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((blog) => (
          <article key={blog._id} className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition hover:-translate-y-0.5 hover:border-zinc-700">
            <Image
              src={blog.headerImage.url}
              alt={blog.headerImage.alt}
              width={1000}
              height={560}
              loading="lazy"
              fetchPriority="low"
              sizes="(max-width: 1024px) 100vw, 900px"
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{blog.categoryName || "General"}</p>
              <h2 className="line-clamp-2 text-base font-semibold text-zinc-100">{blog.title}</h2>
              <p className="my-2 line-clamp-3 text-sm text-zinc-400">{blog.excerpt}</p>
              <Link className="text-sm text-zinc-300 underline" href={`/blog/${blog.slug}`}>
                View Blog
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        {currentPage > 1 ? (
          <Link
            href={`/blog?page=${currentPage - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className="rounded border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded border border-zinc-800 px-4 py-2 text-sm text-zinc-600">Previous</span>
        )}

        <span className="text-sm text-zinc-500">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages ? (
          <Link
            href={`/blog?page=${currentPage + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className="rounded border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200"
          >
            Next
          </Link>
        ) : (
          <span className="rounded border border-zinc-800 px-4 py-2 text-sm text-zinc-600">Next</span>
        )}
      </div>
    </>
  );
}
