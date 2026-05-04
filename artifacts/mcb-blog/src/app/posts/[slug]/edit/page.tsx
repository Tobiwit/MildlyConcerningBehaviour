"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  categoryId: string | null;
  authorId: string;
}

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", coverImage: "", categoryId: "", published: false });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/posts/${slug}?bySlug=true`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([postData, catsData]) => {
      setPost(postData);
      setCategories(catsData);
      setForm({
        title: postData.title ?? "",
        slug: postData.slug ?? "",
        excerpt: postData.excerpt ?? "",
        content: postData.content ?? "",
        coverImage: postData.coverImage ?? "",
        categoryId: postData.categoryId ?? "",
        published: postData.published ?? false,
      });
      setFetching(false);
    }).catch(() => setFetching(false));
  }, [slug]);

  const role = (session?.user as { role?: string })?.role;
  const canEdit = post && (session?.user?.id === post.authorId || role === "admin");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!post) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/posts/${data.slug}`);
      } else {
        setError(data.error || "Failed to update post.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!post || !confirm("Delete this post? This cannot be undone.")) return;
    const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (res.ok) router.push("/");
  }

  if (fetching) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
  if (!canEdit) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">You don&apos;t have permission to edit this post.</p></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Edit post</h1>
        <button onClick={handleDelete} className="text-sm text-destructive hover:underline">Delete post</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">{error}</div>}

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 text-lg font-semibold rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Slug *</label>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="w-full px-3 py-2 text-sm font-mono rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">No category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Cover image URL</label>
            <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Content * (Markdown)</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={16} required className="w-full px-3 py-2 text-sm font-mono rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-primary" />
          Published
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-60">
            {loading && <Loader2 size={14} className="animate-spin" />}
            Save changes
          </button>
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-border rounded-md text-sm hover:bg-accent">Cancel</button>
        </div>
      </form>
    </div>
  );
}
