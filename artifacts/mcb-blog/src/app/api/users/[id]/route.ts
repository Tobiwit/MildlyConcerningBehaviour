import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const sessionId = (session.user as { id?: string })?.id;
    const role = (session.user as { role?: string })?.role;
    const isSelf = sessionId === id;
    const isAdmin = role === "admin";

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = await req.json();
    const { role: newRole, bio, avatar } = body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(newRole && isAdmin ? { role: newRole } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
      },
    });

    return NextResponse.json({ id: updated.id, name: updated.name, role: updated.role });
  } catch {
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string })?.role;
    if (!session || role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
