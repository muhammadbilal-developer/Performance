"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { useState } from "react";
import { marked } from "marked";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold as BoldIcon,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Table2,
  Unlink,
} from "lucide-react";
import { useCategories, useCreateArticle } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogEditorClient() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [status, setStatus] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [markdownInput, setMarkdownInput] = useState("");
  const { data: categoryData } = useCategories();
  const createArticleMutation = useCreateArticle();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "<p>Write your blog content here...</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[320px] rounded border border-zinc-700 bg-black p-4 text-zinc-200 focus:outline-none",
      },
    },
  });

  async function uploadFile(file, folder) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data.url;
  }

  async function onUploadHeaderImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Uploading header image...");
    try {
      const url = await uploadFile(file, "blog");
      setHeaderImage(url);
      setStatus("Header image uploaded.");
    } catch (error) {
      setStatus(String(error));
    }
  }

  async function onEmbedImage(event) {
    const file = event.target.files?.[0];
    if (!file || !editor) return;
    setStatus("Uploading content image...");
    try {
      const url = await uploadFile(file, "blog");
      editor.chain().focus().setImage({ src: url, alt: title || "Article image" }).run();
      setStatus("Image embedded in content.");
    } catch (error) {
      setStatus(String(error));
    }
  }

  async function onCreateBlog() {
    if (!editor) return;
    setStatus("Creating blog...");
    try {
      const payload = {
        title,
        slug,
        categoryId,
        excerpt,
        metaTitle,
        metaDescription,
        keywords: keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        canonicalUrl,
        headerImage: {
          url: headerImage,
          alt: title || "Header image",
        },
        contentHtml: editor.getHTML(),
      };
      const data = await createArticleMutation.mutateAsync(payload);
      setStatus(`Blog created successfully: ${data.slug}`);
    } catch (error) {
      setStatus(error?.response?.data?.message || "Blog creation failed.");
    }
  }

  function onSetLink() {
    const url = window.prompt("Enter URL");
    if (!url || !editor) return;
    editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
  }

  function onInsertMarkdown() {
    if (!editor || !markdownInput.trim()) return;
    const html = marked.parse(markdownInput);
    editor.chain().focus().insertContent(html).run();
    setMarkdownInput("");
    setStatus("Markdown inserted.");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog title" />
        <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug (optional)" />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
        >
          <option value="">Select category</option>
          {(categoryData?.items || []).map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <Input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="Canonical URL (optional)" />
        <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Excerpt" className="md:col-span-2" rows={3} />
        <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Meta title" className="md:col-span-2" />
        <Textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="Meta description"
          className="md:col-span-2"
          rows={3}
        />
        <Input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Keywords comma separated"
          className="md:col-span-2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="border-zinc-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upload Header Image</CardTitle>
          </CardHeader>
          <CardContent>
          <p className="mb-2 text-sm text-zinc-400">Upload Header Image</p>
          <input type="file" accept="image/*" onChange={onUploadHeaderImage} />
          {headerImage ? <p className="mt-2 text-xs text-zinc-500">{headerImage}</p> : null}
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-700">
        <CardContent className="p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleBold().run()}>
            <BoldIcon className="mr-1 h-4 w-4" />
            Bold
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="mr-1 h-4 w-4" />
            H1
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="mr-1 h-4 w-4" />
            H2
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="mr-1 h-4 w-4" />
            H3
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().setParagraph().run()}>
            <Pilcrow className="mr-1 h-4 w-4" />
            Paragraph
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            <List className="mr-1 h-4 w-4" />
            Bullet List
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="mr-1 h-4 w-4" />
            Ordered List
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
            <AlignLeft className="mr-1 h-4 w-4" />
            Align Left
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
            <AlignCenter className="mr-1 h-4 w-4" />
            Align Center
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
            <AlignRight className="mr-1 h-4 w-4" />
            Align Right
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
            <Table2 className="mr-1 h-4 w-4" />
            Insert Table
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onSetLink}>
            <Link2 className="mr-1 h-4 w-4" />
            Add Link
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().unsetLink().run()}>
            <Unlink className="mr-1 h-4 w-4" />
            Remove Link
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setIsPreview((v) => !v)}>
            <Eye className="mr-1 h-4 w-4" />
            {isPreview ? "Edit" : "Preview"}
          </Button>
          <label className="inline-flex cursor-pointer items-center rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-200">
            <ImagePlus className="mr-1 h-4 w-4" />
            Embed Image
            <input type="file" accept="image/*" onChange={onEmbedImage} className="hidden" />
          </label>
        </div>
        <div className="mb-3 grid gap-2">
          <Textarea
            value={markdownInput}
            onChange={(e) => setMarkdownInput(e.target.value)}
            placeholder="Paste markdown here..."
            rows={4}
          />
          <Button type="button" variant="outline" size="sm" onClick={onInsertMarkdown} className="w-fit">
            Insert Markdown
          </Button>
        </div>
        {isPreview ? (
          <div
            className="editor-preview min-h-[320px] rounded border border-zinc-700 bg-black p-4 text-zinc-200"
            dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
        </CardContent>
      </Card>

      <Button onClick={onCreateBlog}>
        Create Blog
      </Button>
      <p className="text-sm text-zinc-400">{status}</p>
    </div>
  );
}
