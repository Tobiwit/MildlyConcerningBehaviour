import Link from "next/link";
import { formatDate, readingTime } from "@/lib/utils";
import { Heart, MessageCircle, Clock } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    createdAt: Date | string;
    author: { id: string; name: string; avatar: string | null };
    category: { id: string; name: string; slug: string } | null;
    _count: { likes: number; comments: number };
  };
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <article className="glass group relative rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300">
        {post.coverImage && (
          <div className="relative h-52 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          </div>
        )}
        <div className="p-6">
          {post.category && (
            <Link
              href={`/categories/${post.category.slug}`}
              className="inline-block text-[11px] font-bold tracking-widest uppercase text-primary mb-3 hover:underline"
            >
              {post.category.name}
            </Link>
          )}
          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-2xl font-black leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>
          {post.excerpt && (
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {readingTime(post.content)}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={11} />
                {post._count.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={11} />
                {post._count.comments}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex gap-4 py-5 last:pb-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-[10px]">
            {post.author.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-muted-foreground">{post.author.name}</span>
          {post.category && (
            <>
              <span className="text-muted-foreground/30">·</span>
              <Link href={`/categories/${post.category.slug}`} className="text-xs text-primary hover:underline font-medium">
                {post.category.name}
              </Link>
            </>
          )}
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h3 className="font-bold text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2.5">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDate(post.createdAt)}</span>
          <span className="flex items-center gap-1"><Clock size={11} />{readingTime(post.content)}</span>
          <span className="flex items-center gap-1"><Heart size={11} />{post._count.likes}</span>
          <span className="flex items-center gap-1"><MessageCircle size={11} />{post._count.comments}</span>
        </div>
      </div>
      {post.coverImage && (
        <Link href={`/posts/${post.slug}`} className="flex-shrink-0">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-24 h-20 object-cover rounded-xl group-hover:opacity-90 transition-opacity"
          />
        </Link>
      )}
    </article>
  );
}
