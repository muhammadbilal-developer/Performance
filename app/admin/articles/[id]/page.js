import EditArticleClient from "./EditArticleClient";

export const metadata = {
  title: "Edit Article | Admin",
};

export default async function EditArticlePage({ params }) {
  const { id } = await params;
  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold text-zinc-100">Edit Article</h1>
      <EditArticleClient articleId={id} />
    </main>
  );
}
