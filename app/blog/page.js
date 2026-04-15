import BlogListClient from "./BlogListClient";
import { Suspense } from "react";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import BlogSkeletonGrid from "./BlogSkeletonGrid";

export const revalidate = 3600;

export default function BlogListPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6 sm:p-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blogs" }]} />
      <h1 className="mb-6 text-3xl font-bold text-zinc-100">All Blogs</h1>
      <Suspense fallback={<BlogSkeletonGrid />}>
        <BlogListClient />
      </Suspense>
    </main>
  );
}
