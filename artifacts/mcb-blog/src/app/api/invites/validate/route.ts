import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ valid: false });

  const invite = await prisma.invite.findUnique({
    where: { token },
    select: { used: true, email: true, expiresAt: true },
  });

  const valid =
    !!invite &&
    !invite.used &&
    (!invite.expiresAt || new Date(invite.expiresAt) > new Date());

  return NextResponse.json({ valid, email: valid ? (invite?.email ?? null) : null });
}
