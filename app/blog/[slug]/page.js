import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs } from "@/lib/blogs";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6 sm:p-10">
      <h1 className="mb-3 text-3xl font-bold">{blog.title}</h1>
      <p className="mb-6 text-zinc-700">{blog.excerpt}</p>

      <section>
        <figure className="mb-10 overflow-hidden rounded border">
          <Image
            src={blog.headerImage.url}
            alt={blog.headerImage.alt}
            width={1200}
            height={700}
            priority
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="h-auto w-full object-cover"
          />
        </figure>

        <article className="space-y-8">
          {blog.contentSections.map((section, index) => {
            if (section.type === "image" && section.image) {
              return (
                <figure key={`${blog.slug}-section-image-${index}`} className="overflow-hidden rounded border">
                  <Image
                    src={section.image.url}
                    alt={section.image.alt}
                    width={1000}
                    height={620}
                    loading="lazy"
                    fetchPriority="low"
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="h-auto w-full object-cover"
                  />
                </figure>
              );
            }

            return (
              <p key={`${blog.slug}-section-paragraph-${index}`} className="text-lg leading-8 text-zinc-800">
                {section.text}
              </p>
            );
          })}
        </article>
      </section>
    </main>
  );
}
