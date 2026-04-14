import Image from "next/image";
import Link from "next/link";
import { getBlogs } from "@/lib/blogs";

export const revalidate = 3600;

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6 sm:p-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">MongoDB Blog (ISR + On-Demand ISR)</h1>
        <Link className="rounded bg-black px-4 py-2 text-white" href="/blog">
          All Blogs
        </Link>
      </div>

      <p className="mb-6 text-sm text-zinc-600">
        Total seeded blogs: <strong>{blogs.length}</strong>
      </p>

      <div className="grid gap-4">
        {blogs.slice(0, 10).map((blog) => (
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
              Read Blog
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
