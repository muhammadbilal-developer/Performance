"use client";

import { useState } from "react";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/lib/api/hooks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesClient() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const { data } = useCategories();
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();

  async function onCreate() {
    if (!name.trim()) {
      setStatus("Category name is required.");
      return;
    }
    try {
      const response = await createMutation.mutateAsync({ name, description });
      setName("");
      setDescription("");
      setStatus(response?.message || "Category created.");
    } catch (error) {
      setStatus(error?.response?.data?.message || "Failed to create category.");
    }
  }

  async function onDelete(id) {
    try {
      const response = await deleteMutation.mutateAsync(id);
      setStatus(response?.message || "Category deleted.");
    } catch (error) {
      setStatus(error?.response?.data?.message || "Failed to delete category.");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
          />
          <Button onClick={onCreate} className="w-fit">
            Add Category
          </Button>
          <p className="text-sm text-zinc-500">{status}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
        <ul className="space-y-2">
          {(data?.items || []).map((category) => (
            <li key={category._id} className="flex items-center justify-between border-b border-zinc-800 py-2 text-sm">
              <div>
                <p className="text-zinc-200">{category.name}</p>
                <p className="text-zinc-500">{category.slug}</p>
              </div>
              <Button onClick={() => onDelete(category._id)} variant="destructive" size="sm">
                Delete
              </Button>
            </li>
          ))}
        </ul>
        </CardContent>
      </Card>
    </div>
  );
}
