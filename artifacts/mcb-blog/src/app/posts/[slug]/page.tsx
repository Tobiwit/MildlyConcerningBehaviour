import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatDate, readingTime } from "@/lib/utils";
import Link from "next/link";
import { CommentSection } from "@/components/CommentSection";
import { LikeButton } from "@/components/LikeButton";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Clock, ArrowLeft, Tag, Edit } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, select: { title: true, excerpt: true } });
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, avatar: true, bio: true } },
      category: { select: { id: true, name: true, slug: true } },
      comments: {
        include: { author: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      },
      likes: { select: { userId: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post || (!post.published && session?.user?.id !== post.authorId && (session?.user as { role?: string })?.role !== "admin")) {
    notFound();
  }

  const userId = session?.user?.id;
  const hasLiked = userId ? post.likes.some((l) => l.userId === userId) : false;
  const canEdit = userId === post.authorId || (session?.user as { role?: string })?.role === "admin";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>

      <article>
        {/* Header — no panel, floats over background */}
        <div className="mb-8">
          {post.category && (
            <Link href={`/categories/${post.category.slug}`} className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-primary mb-4 hover:underline">
              <Tag size={11} />
              {post.category.name}
            </Link>
          )}

          {!post.published && (
            <span className="inline-block rounded-full bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 text-xs text-yellow-600 dark:text-yellow-400 mb-4 ml-2">
              Draft
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-5">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Clock size={12} />
              {readingTime(post.content)}
            </div>
            {canEdit && (
              <Link
                href={`/posts/${post.slug}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Edit size={12} />
                Edit post
              </Link>
            )}
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative mb-8 rounded-2xl overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="w-full max-h-96 object-cover" />
          </div>
        )}

        {/* Article body — glass panel for readability */}
        <div className="glass rounded-2xl px-7 py-8 mb-6">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>

        {/* Author bio — glass panel */}
        {post.author.bio && (
          <div className="glass rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold shrink-0">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">{post.author.bio}</p>
              </div>
            </div>
          </div>
        )}

        {/* Likes + comment count */}
        <div className="flex items-center gap-4 py-5 mb-2">
          <LikeButton postId={post.id} initialCount={post._count.likes} initialHasLiked={hasLiked} />
          <span className="text-sm text-muted-foreground">{post._count.comments} comments</span>
        </div>

        {/* Comments — glass panel */}
        <div className="glass rounded-2xl px-6 py-6">
          <CommentSection
            postId={post.id}
            comments={post.comments}
            session={session}
          />
        </div>
      </article>
    </div>
  );
}
