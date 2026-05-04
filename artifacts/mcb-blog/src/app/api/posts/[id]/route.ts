import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const bySlug = req.nextUrl.searchParams.get("bySlug") === "true";

    const post = bySlug
      ? await prisma.post.findUnique({ where: { slug: id } })
      : await prisma.post.findUnique({ where: { id } });

    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "Failed to fetch post." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });

    const role = (session.user as { role?: string }).role;
    if (post.authorId !== session.user.id && role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, categoryId, published } = body;

    if (slug && slug !== post.slug) {
      const existing = await prisma.post.findUnique({ where: { slug } });
      if (existing) return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title: title ?? post.title,
        slug: slug ?? post.slug,
        excerpt: excerpt !== undefined ? (excerpt || null) : post.excerpt,
        content: content ?? post.content,
        coverImage: coverImage !== undefined ? (coverImage || null) : post.coverImage,
        categoryId: categoryId !== undefined ? (categoryId || null) : post.categoryId,
        published: published !== undefined ? published : post.published,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });

    const role = (session.user as { role?: string }).role;
    if (post.authorId !== session.user.id && role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
  }
}
