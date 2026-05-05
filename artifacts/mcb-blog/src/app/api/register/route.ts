import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, token } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }
    if (!token) {
      return NextResponse.json({ error: "An invite link is required to register." }, { status: 403 });
    }

    const invite = await prisma.invite.findUnique({ where: { token } });
    if (!invite || invite.used || (invite.expiresAt && new Date(invite.expiresAt) < new Date())) {
      return NextResponse.json({ error: "This invite link is invalid or has already been used." }, { status: 403 });
    }

    if (invite.email && invite.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: `This invite is for ${invite.email}.` }, { status: 403 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: "author" },
    });

    await prisma.invite.update({
      where: { token },
      data: { used: true, usedAt: new Date(), usedBy: user.id },
    });

    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
