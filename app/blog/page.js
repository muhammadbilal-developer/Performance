import Image from "next/image";
import Link from "next/link";
import { getBlogs } from "@/lib/blogs";

export const revalidate = 3600;

const PAGE_SIZE = 6;

export default async function BlogListPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const blogs = await getBlogs();
  const totalPages = Math.max(1, Math.ceil(blogs.length / PAGE_SIZE));
  const requestedPage = Number(resolvedSearchParams?.page || 1);
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.min(Math.max(requestedPage, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedBlogs = blogs.slice(start, start + PAGE_SIZE);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6 sm:p-10">
      <h1 className="mb-6 text-3xl font-bold">All Blogs</h1>
      <div className="grid gap-4">
        {paginatedBlogs.map((blog) => (
          <article key={blog.slug} className="rounded border p-4">
            <Image
              src={blog.headerImage.url}
              alt={blog.headerImage.alt}
              width={1000}
              height={560}
              loading="lazy"
              fetchPriority="low"
              sizes="(max-width: 1024px) 100vw, 900px"
              className="mb-4 h-auto w-full rounded object-cover"
            />
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="my-2 text-zinc-700">{blog.excerpt}</p>
            <Link className="text-blue-600 underline" href={`/blog/${blog.slug}`}>
              View Blog
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        {currentPage > 1 ? (
          <Link
            href={`/blog?page=${currentPage - 1}`}
            className="rounded border px-4 py-2 text-sm font-medium"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded border px-4 py-2 text-sm text-zinc-400">Previous</span>
        )}

        <span className="text-sm text-zinc-600">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages ? (
          <Link href={`/blog?page=${currentPage + 1}`} className="rounded border px-4 py-2 text-sm font-medium">
            Next
          </Link>
        ) : (
          <span className="rounded border px-4 py-2 text-sm text-zinc-400">Next</span>
        )}
      </div>
    </main>
  );
}
