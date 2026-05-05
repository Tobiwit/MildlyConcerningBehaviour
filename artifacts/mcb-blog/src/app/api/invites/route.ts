import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const invites = await prisma.invite.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invites);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = (session.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "No user id" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const email = body.email?.trim() || null;

  const invite = await prisma.invite.create({
    data: { email, createdBy: userId },
  });

  return NextResponse.json(invite, { status: 201 });
}
