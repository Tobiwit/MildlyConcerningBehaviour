import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";
import { TrendingUp, Layers, AlertTriangle, PenLine } from "lucide-react";

async function getPosts() {
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
      <section className="relative px-4 sm:px-6 pt-16 pb-14 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-primary/40 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6 badge-tilt">
            <AlertTriangle size={12} />
            <span>Proceed with caution</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black leading-[0.9] mb-6">
            Mildly{" "}
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(135deg, hsl(320 100% 55%), hsl(270 100% 65%), hsl(170 100% 45%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Concerning
            </span>
            <br />
            <span className="squiggle">Behavior</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mb-8">
            A corner of the internet for{" "}
            <strong className="text-foreground">edgy thoughts</strong>,
            questionable takes, and observations that probably shouldn&apos;t be
            published. Written by people who are definitely fine.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="#posts"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all hover:scale-105 active:scale-95"
            >
              <TrendingUp size={15} />
              Read the chaos
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-border rounded-xl font-bold text-sm hover:border-primary hover:text-primary transition-colors"
            >
              <PenLine size={15} />
              Start writing
            </Link>
          </div>
        </div>

        {/* decorative squiggle divider */}
        <div className="mt-14 h-px w-full" style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), hsl(270 100% 65% / 0.4), transparent)"
        }} />
      </section>

      {/* Main content */}
      <div id="posts" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          <div>
            {posts.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                <p className="text-5xl mb-4">✍️</p>
                <h2 className="text-xl font-bold mb-2">Nothing concerning yet</h2>
                <p className="text-muted-foreground mb-6">Be the first to post something mildly alarming.</p>
                <Link href="/register" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity text-sm font-bold">
                  Get started
                </Link>
              </div>
            ) : (
              <>
                {featured && (
                  <section className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={14} className="text-primary" />
                      <h2 className="text-xs font-black tracking-widest uppercase text-muted-foreground">Featured</h2>
                    </div>
                    <PostCard post={featured} featured />
                  </section>
                )}

                {rest.length > 0 && (
                  <section>
                    <h2 className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-4">Latest</h2>
                    <div className="rounded-2xl border-2 border-border bg-card/40 divide-y divide-border overflow-hidden px-4">
                      {rest.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border-2 border-border bg-card/40 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={14} className="text-primary" />
                <h3 className="text-xs font-black tracking-widest uppercase">Categories</h3>
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
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-bold">
                          {cat._count.posts}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-5xl opacity-10 font-black leading-none pr-3 pt-1 select-none">!</div>
              <h3 className="text-xs font-black tracking-widest uppercase text-primary mb-2">What is this</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A place for mildly concerning thoughts, ideas, and observations. Curated by writers who probably know what they&apos;re doing. Probably.
              </p>
              <Link
                href="/register"
                className="mt-4 block text-center text-sm px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all font-bold hover:scale-[1.02] active:scale-95"
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
