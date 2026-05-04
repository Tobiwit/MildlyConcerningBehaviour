import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const userId = session.user.id;
    const existing = await prisma.like.findUnique({ where: { postId_userId: { postId: id, userId } } });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      const count = await prisma.like.count({ where: { postId: id } });
      return NextResponse.json({ liked: false, count });
    } else {
      await prisma.like.create({ data: { postId: id, userId } });
      const count = await prisma.like.count({ where: { postId: id } });
      return NextResponse.json({ liked: true, count });
    }
  } catch {
    return NextResponse.json({ error: "Failed to toggle like." }, { status: 500 });
  }
}
