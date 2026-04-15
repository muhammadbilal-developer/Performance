import ArticlesClient from "./ArticlesClient";

export const metadata = {
  title: "Articles | Admin",
};

export default function AdminArticlesPage() {
  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold text-zinc-100">Articles</h1>
      <p className="mb-6 text-zinc-500">Create, edit, and delete articles from a single workspace.</p>
      <ArticlesClient />
    </main>
  );
}
