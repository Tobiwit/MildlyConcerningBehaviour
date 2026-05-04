import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/AdminPanel";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Panel" };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;

  if (!session || role !== "admin") {
    redirect("/");
  }

  const [users, posts, categories] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { posts: true } } },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage users, posts, and categories.</p>
      <AdminPanel users={users} posts={posts} categories={categories} />
    </div>
  );
}
