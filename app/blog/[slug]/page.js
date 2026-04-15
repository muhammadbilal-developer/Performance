import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs } from "@/lib/blogs";
import PageViewTracker from "@/components/PageViewTracker";

export const revalidate = 3600;
export const dynamicParams = true;
const PREBUILD_BLOG_COUNT = 20;

function enforceLowPriorityContentImages(html) {
  if (!html) return html;
  return html.replace(/<img\b([^>]*)>/gi, (full, attrs) => {
    let nextAttrs = attrs || "";
    if (!/\sloading\s*=/i.test(nextAttrs)) nextAttrs += ' loading="lazy"';
    if (!/\sfetchpriority\s*=/i.test(nextAttrs)) nextAttrs += ' fetchpriority="low"';
    if (!/\sdecoding\s*=/i.test(nextAttrs)) nextAttrs += ' decoding="async"';
    return `<img${nextAttrs}>`;
  });
}

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.slice(0, PREBUILD_BLOG_COUNT).map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Article not found",
      description: "The requested article was not found.",
    };
  }

  return {
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    keywords: blog.seo?.keywords || [],
    alternates: {
      canonical: blog.seo?.canonicalUrl,
    },
    openGraph: {
      title: blog.seo?.metaTitle || blog.title,
      description: blog.seo?.metaDescription || blog.excerpt,
      images: [blog.headerImage?.url],
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6 sm:p-10">
      <PageViewTracker />
      <h1 className="mb-3 text-3xl font-bold text-zinc-100">{blog.title}</h1>
      <p className="mb-6 text-zinc-400">{blog.excerpt}</p>

      <section>
        <figure className="mb-10 overflow-hidden rounded border border-zinc-800">
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

        <article className="prose-dark space-y-8">
          {blog.contentHtml ? (
            <div
              className="text-lg leading-8 text-zinc-300"
              dangerouslySetInnerHTML={{ __html: enforceLowPriorityContentImages(blog.contentHtml) }}
            />
          ) : (
            blog.contentSections.map((section, index) => {
            if (section.type === "image" && section.image) {
              return (
                <figure key={`${blog.slug}-section-image-${index}`} className="overflow-hidden rounded border border-zinc-800">
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

            if (section.type === "heading" && section.text) {
              return (
                <h2 key={`${blog.slug}-section-heading-${index}`} className="text-2xl font-semibold text-zinc-100">
                  {section.text}
                </h2>
              );
            }

            return (
              <p key={`${blog.slug}-section-paragraph-${index}`} className="text-lg leading-8 text-zinc-300">
                {section.text}
              </p>
            );
            })
          )}
        </article>
      </section>
    </main>
  );
}
