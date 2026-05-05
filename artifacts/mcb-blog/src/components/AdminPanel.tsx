"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Trash2, Edit, Users, FileText, Tag, Plus, Loader2, Shield, Link2, Copy, Check, Mail } from "lucide-react";

type AdminUser = {
  id: string; name: string; email: string; role: string; createdAt: Date | string;
  _count: { posts: number };
};

type AdminPost = {
  id: string; title: string; slug: string; published: boolean; createdAt: Date | string;
  author: { id: string; name: string };
  category: { id: string; name: string } | null;
  _count: { likes: number; comments: number };
};

type AdminCategory = {
  id: string; name: string; slug: string;
  _count: { posts: number };
};

type AdminInvite = {
  id: string; token: string; email: string | null; used: boolean;
  usedAt: Date | string | null; createdAt: Date | string; expiresAt: Date | string | null;
};

export function AdminPanel({
  users, posts, categories, invites,
}: {
  users: AdminUser[]; posts: AdminPost[]; categories: AdminCategory[]; invites: AdminInvite[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"posts" | "users" | "categories" | "invites">("posts");
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });
  const [addingCat, setAddingCat] = useState(false);
  const [catError, setCatError] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");
  const [creatingInvite, setCreatingInvite] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this user and all their content?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "author" : "admin";
    const res = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) router.refresh();
  }

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatError("");
    setAddingCat(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    });
    const data = await res.json();
    if (res.ok) {
      setNewCategory({ name: "", slug: "" });
      router.refresh();
    } else {
      setCatError(data.error || "Failed.");
    }
    setAddingCat(false);
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  async function createInvite(e: React.FormEvent) {
    e.preventDefault();
    setCreatingInvite(true);
    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail || null }),
    });
    if (res.ok) {
      setInviteEmail("");
      router.refresh();
    }
    setCreatingInvite(false);
  }

  async function deleteInvite(id: string) {
    const res = await fetch(`/api/invites/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  function copyInviteLink(token: string, id: string) {
    const url = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  const unusedInvites = invites.filter((i) => !i.used);
  const usedInvites = invites.filter((i) => i.used);

  const tabs = [
    { id: "posts" as const, label: "Posts", icon: FileText, count: posts.length },
    { id: "users" as const, label: "Users", icon: Users, count: users.length },
    { id: "categories" as const, label: "Categories", icon: Tag, count: categories.length },
    { id: "invites" as const, label: "Invites", icon: Link2, count: unusedInvites.length },
  ];

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
              tab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={14} />
            {label}
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">{count}</span>
          </button>
        ))}
      </div>

      {tab === "posts" && (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Title</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Author</th>
                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Status</th>
                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/posts/${post.slug}`} className="font-medium hover:text-primary transition-colors line-clamp-1">
                      {post.title}
                    </Link>
                    {post.category && <span className="text-xs text-muted-foreground ml-2">{post.category.name}</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{post.author.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${post.published ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs">{formatDate(post.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/posts/${post.slug}/edit`} className="text-muted-foreground hover:text-foreground transition-colors">
                        <Edit size={14} />
                      </Link>
                      <button onClick={() => deletePost(post.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Posts</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{user._count.posts}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleRole(user.id, user.role)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title={`Make ${user.role === "admin" ? "author" : "admin"}`}
                      >
                        <Shield size={14} />
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "categories" && (
        <div className="space-y-4">
          <form onSubmit={createCategory} className="flex gap-3 p-4 rounded-xl border border-border bg-card/50">
            <input
              value={newCategory.name}
              onChange={(e) => setNewCategory({ name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
              placeholder="Category name"
              required
              className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              value={newCategory.slug}
              onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              placeholder="slug"
              required
              className="w-36 px-3 py-2 text-sm font-mono rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="submit" disabled={addingCat} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90 disabled:opacity-60">
              {addingCat ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add
            </button>
          </form>
          {catError && <p className="text-sm text-destructive">{catError}</p>}

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Slug</th>
                  <th className="px-4 py-3 text-left font-semibold">Posts</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">{cat._count.posts}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button onClick={() => deleteCategory(cat.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "invites" && (
        <div className="space-y-6">
          <form onSubmit={createInvite} className="p-4 rounded-xl border border-border bg-card/50 space-y-3">
            <h3 className="text-sm font-semibold">Generate an invite link</h3>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Specific email (optional)"
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="submit"
                disabled={creatingInvite}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
              >
                {creatingInvite ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Generate link
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              If you enter an email, only that address can use the link.
            </p>
          </form>

          {unusedInvites.length > 0 && (
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3">Active invites</h3>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">For</th>
                      <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Created</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {unusedInvites.map((invite) => (
                      <tr key={invite.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          {invite.email ? (
                            <span className="font-medium text-sm">{invite.email}</span>
                          ) : (
                            <span className="text-muted-foreground text-xs italic">Anyone with the link</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                          {formatDate(invite.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => copyInviteLink(invite.token, invite.id)}
                              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
                              title="Copy invite link"
                            >
                              {copiedId === invite.id ? (
                                <><Check size={12} className="text-green-500" /> Copied</>
                              ) : (
                                <><Copy size={12} /> Copy link</>
                              )}
                            </button>
                            <button
                              onClick={() => deleteInvite(invite.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              title="Revoke invite"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {usedInvites.length > 0 && (
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3">Used invites</h3>
              <div className="rounded-xl border border-border overflow-hidden opacity-60">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">For</th>
                      <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Used</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {usedInvites.map((invite) => (
                      <tr key={invite.id}>
                        <td className="px-4 py-3">
                          {invite.email ?? <span className="italic text-muted-foreground text-xs">Open invite</span>}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                          {invite.usedAt ? formatDate(invite.usedAt) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {invites.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No invites yet. Generate one above.</p>
          )}
        </div>
      )}
    </div>
  );
}
