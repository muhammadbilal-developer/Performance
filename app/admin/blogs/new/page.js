import BlogEditorClient from "./BlogEditorClient";

export const metadata = {
  title: "Admin Blog Creator | Calculator Insight Hub",
  description: "Create and publish blog articles with embedded images and SEO fields.",
};

export default function AdminCreateBlogPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-6 sm:p-10">
      <h1 className="mb-2 text-3xl font-bold text-zinc-100">Admin Blog Creator</h1>
      <p className="mb-8 text-zinc-400">
        Use this editor to upload header/logo images, embed content images, and publish SEO-optimized blog articles.
      </p>
      <BlogEditorClient />
    </main>
  );
}
