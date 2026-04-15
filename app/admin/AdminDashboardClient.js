"use client";

import Link from "next/link";
import { useAnalytics } from "@/lib/api/hooks";

export default function AdminDashboardClient() {
  const { data, isLoading } = useAnalytics();

  if (isLoading) return <p className="text-zinc-500">Loading analytics...</p>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-500">Total Articles</p>
          <p className="text-3xl font-semibold text-zinc-100">{data?.totalArticles || 0}</p>
        </article>
        <article className="rounded border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-500">Total Categories</p>
          <p className="text-3xl font-semibold text-zinc-100">{data?.totalCategories || 0}</p>
        </article>
        <article className="rounded border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-500">Page Views</p>
          <p className="text-3xl font-semibold text-zinc-100">{data?.pageViews || 0}</p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded border border-zinc-800 bg-zinc-950 p-4">
          <h2 className="mb-3 text-lg font-semibold text-zinc-100">Recent Articles</h2>
          <ul className="space-y-2 text-sm text-zinc-400">
            {(data?.recentArticles || []).map((item) => (
              <li key={item._id} className="flex items-center justify-between">
                <span>{item.title}</span>
                <Link href={`/blog/${item.slug}`} className="text-zinc-300 underline">
                  View
                </Link>
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded border border-zinc-800 bg-zinc-950 p-4">
          <h2 className="mb-3 text-lg font-semibold text-zinc-100">Top Categories</h2>
          <ul className="space-y-2 text-sm text-zinc-400">
            {(data?.topCategories || []).map((item) => (
              <li key={item._id || "uncategorized"} className="flex items-center justify-between">
                <span>{item._id || "Uncategorized"}</span>
                <span>{item.count}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
