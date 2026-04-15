"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { useCategories, useUpdateArticle } from "@/lib/api/hooks";

export default function EditArticleClient({ articleId }) {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("");
  const { data: categories } = useCategories();
  const updateMutation = useUpdateArticle();

  useEffect(() => {
    async function load() {
      const { data } = await apiClient.get(`/articles/${articleId}`);
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        categoryId: data.categoryId?._id || data.categoryId || "",
        contentHtml: data.contentHtml || "",
      });
    }
    load();
  }, [articleId]);

  if (!form) return <p className="text-zinc-500">Loading article...</p>;

  async function onSave() {
    try {
      await updateMutation.mutateAsync({ id: articleId, payload: form });
      setStatus("Article updated.");
    } catch (error) {
      setStatus(error?.response?.data?.message || "Update failed.");
    }
  }

  return (
    <div className="space-y-4 rounded border border-zinc-800 bg-zinc-950 p-4">
      <input
        value={form.title}
        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        className="w-full rounded border border-zinc-700 px-3 py-2"
        placeholder="Title"
      />
      <input
        value={form.slug}
        onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
        className="w-full rounded border border-zinc-700 px-3 py-2"
        placeholder="Slug"
      />
      <select
        value={form.categoryId}
        onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
        className="w-full rounded border border-zinc-700 px-3 py-2"
      >
        <option value="">Select category</option>
        {(categories?.items || []).map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <textarea
        value={form.excerpt}
        onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
        className="w-full rounded border border-zinc-700 px-3 py-2"
        rows={3}
        placeholder="Excerpt"
      />
      <textarea
        value={form.contentHtml}
        onChange={(e) => setForm((prev) => ({ ...prev, contentHtml: e.target.value }))}
        className="min-h-[280px] w-full rounded border border-zinc-700 px-3 py-2"
        placeholder="Content HTML"
      />
      <button onClick={onSave} className="rounded bg-zinc-100 px-4 py-2 text-black">
        Save
      </button>
      <p className="text-sm text-zinc-500">{status}</p>
    </div>
  );
}
