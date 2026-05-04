import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";
import { TrendingUp, Layers, PenLine } from "lucide-react";
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

async function getPosts() {
  noStore();
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

async function getCategories() {
  noStore();
  return prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
}

export default async function HomePage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  const [featured, ...rest] = posts;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-14 pb-12 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <h1 className="text-5xl sm:text-6xl font-black leading-[0.92] mb-5">
            Mildly{" "}
            <span
              style={{
                background: "linear-gradient(125deg, hsl(315 75% 58%), hsl(265 75% 62%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Concerning
            </span>
            <br />
            Behavior
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed max-w-md mb-7">
            A corner of the internet for{" "}
            <strong className="text-foreground font-semibold">edgy thoughts</strong>,
            questionable takes, and observations that probably shouldn&apos;t be
            published. Written by people who are definitely fine.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="#posts"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <TrendingUp size={14} />
              Read the chaos
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl font-semibold text-sm hover:border-primary hover:text-primary transition-colors"
            >
              <PenLine size={14} />
              Start writing
            </Link>
          </div>
        </div>

        <div className="mt-12 h-px w-full" style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.25), transparent)"
        }} />
      </section>

      {/* Main content */}
      <div id="posts" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div>
            {posts.length === 0 ? (
              <div className="glass text-center py-20 rounded-2xl">
                <p className="text-5xl mb-4">✍️</p>
                <h2 className="text-xl font-bold mb-2">Nothing concerning yet</h2>
                <p className="text-muted-foreground mb-6">Be the first to post something mildly alarming.</p>
                <Link href="/register" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold">
                  Get started
                </Link>
              </div>
            ) : (
              <>
                {featured && (
                  <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={13} className="text-primary" />
                      <h2 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Featured</h2>
                    </div>
                    <PostCard post={featured} featured />
                  </section>
                )}

                {rest.length > 0 && (
                  <section>
                    <h2 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Latest</h2>
                    <div className="glass rounded-2xl divide-y divide-border/60 overflow-hidden px-4">
                      {rest.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          <aside className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={13} className="text-primary" />
                <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">Categories</h3>
              </div>
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories yet.</p>
              ) : (
                <ul className="space-y-1.5">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="flex items-center justify-between text-sm hover:text-primary transition-colors group py-0.5"
                      >
                        <span className="group-hover:underline font-medium">{cat.name}</span>
                        <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full font-semibold">
                          {cat._count.posts}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="glass rounded-2xl p-5 border-primary/20">
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-primary mb-2">What is this</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Mildly concerning thoughts, questionable observations, and takes that didn&apos;t quite make it to LinkedIn. Curated by writers who are probably fine.
              </p>
              <Link
                href="/register"
                className="mt-4 block text-center text-sm px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-semibold"
              >
                Join the chaos →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
