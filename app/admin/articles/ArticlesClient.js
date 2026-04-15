"use client";

import Link from "next/link";
import { useDeleteArticle, useArticles } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArticlesClient() {
  const { data, isLoading } = useArticles({ page: 1, limit: 50 });
  const deleteMutation = useDeleteArticle();

  async function onDelete(id) {
    await deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <p className="text-zinc-500">Loading articles...</p>;

  return (
    <Card>
      <CardHeader className="mb-1 flex flex-row items-center justify-between">
        <CardTitle>All Articles</CardTitle>
        <Button asChild>
          <Link href="/admin/articles/new">New Article</Link>
        </Button>
      </CardHeader>
      <CardContent>
      <ul className="space-y-2">
        {(data?.items || []).map((item) => (
          <li key={item._id} className="flex items-center justify-between border-b border-zinc-800 py-2 text-sm">
            <div>
              <p className="text-zinc-200">{item.title}</p>
              <p className="text-zinc-500">{item.slug}</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/articles/${item._id}`}>Edit</Link>
              </Button>
              <Button onClick={() => onDelete(item._id)} variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
      </CardContent>
    </Card>
  );
}
