import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostCard } from "@/components/PostCard";
import { formatDate } from "@/lib/utils";
import { CalendarDays, FileText, Heart } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const name = decodeURIComponent(username).replace(/-/g, " ");
  return { title: `${name}'s profile` };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  const displayName = decodeURIComponent(username).replace(/-/g, " ");

  const user = await prisma.user.findFirst({
    where: { name: { equals: displayName, mode: "insensitive" } },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          category: { select: { id: true, name: true, slug: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
      _count: { select: { posts: true, likes: true } },
    },
  });

  if (!user) notFound();

  const totalLikes = await prisma.like.count({ where: { post: { authorId: user.id } } });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="rounded-2xl border border-border bg-card/60 p-8 mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
            {user.bio && <p className="text-muted-foreground text-sm mb-3">{user.bio}</p>}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays size={12} />
                Joined {formatDate(user.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <FileText size={12} />
                {user._count.posts} posts
              </span>
              <span className="flex items-center gap-1">
                <Heart size={12} />
                {totalLikes} likes received
              </span>
            </div>
          </div>
          <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary capitalize">
            {user.role}
          </div>
        </div>
      </div>

      <h2 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-5">
        Posts by {user.name}
      </h2>

      {user.posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText size={36} className="mx-auto mb-3 opacity-30" />
          <p>No published posts yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card/50 divide-y divide-border overflow-hidden px-4">
          {user.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
