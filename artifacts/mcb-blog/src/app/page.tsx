import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";
import { TrendingUp, Layers } from "lucide-react";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <div>
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">✍️</p>
              <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
              <p className="text-muted-foreground mb-6">Be the first to write something mildly concerning.</p>
              <Link href="/register" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm">
                Get started
              </Link>
            </div>
          ) : (
            <>
              {featured && (
                <section className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-primary" />
                    <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Featured</h2>
                  </div>
                  <PostCard post={featured} featured />
                </section>
              )}

              {rest.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-4">Latest</h2>
                  <div className="rounded-2xl border border-border bg-card/50 divide-y divide-border overflow-hidden px-4">
                    {rest.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={15} className="text-primary" />
              <h3 className="text-sm font-semibold">Categories</h3>
            </div>
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            ) : (
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="flex items-center justify-between text-sm hover:text-primary transition-colors group"
                    >
                      <span className="group-hover:underline">{cat.name}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {cat._count.posts}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card/50 p-5">
            <h3 className="text-sm font-semibold mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A place for mildly concerning thoughts, ideas, and observations. Curated by writers who probably know what they&apos;re doing.
            </p>
            <Link
              href="/register"
              className="mt-4 block text-center text-sm px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Start writing
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
