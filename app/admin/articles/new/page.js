import BlogEditorClient from "@/app/admin/blogs/new/BlogEditorClient";

export const metadata = {
  title: "Create Article | Admin",
};

export default function AdminCreateArticlePage() {
  return (
    <main>
      <h1 className="mb-2 text-3xl font-bold text-zinc-100">Create Article</h1>
      <p className="mb-8 text-zinc-500">Rich text editor with image upload and SEO metadata fields.</p>
      <BlogEditorClient />
    </main>
  );
}
