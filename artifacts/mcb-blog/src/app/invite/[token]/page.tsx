import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "You've been invited" };

interface Props {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params;

  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  const invite = await prisma.invite.findUnique({
    where: { token },
    select: { used: true, email: true, expiresAt: true },
  });

  const isValid =
    invite &&
    !invite.used &&
    (!invite.expiresAt || new Date(invite.expiresAt) > new Date());

  if (!isValid) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
        <div className="glass rounded-3xl px-8 py-10 max-w-sm w-full text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h1 className="text-xl font-black mb-2">Invite not valid</h1>
          <p className="text-sm text-muted-foreground mb-6">
            This link has already been used or has expired. Ask for a new one.
          </p>
          <Link href="/login" className="text-sm text-primary hover:underline font-medium">
            Go to sign in →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="glass rounded-3xl px-8 py-10 max-w-sm w-full text-center">
        <p className="text-5xl mb-5">👋</p>
        <h1 className="text-2xl font-black mb-3">You've been invited</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
          Someone thinks you belong in{" "}
          <strong className="text-foreground">Mildly Concerning Behavior</strong>.
        </p>
        {invite.email && (
          <p className="text-xs text-muted-foreground mb-6">
            This invite is for{" "}
            <span className="text-primary font-semibold">{invite.email}</span>.
          </p>
        )}
        {!invite.email && <div className="mb-6" />}
        <Link
          href={`/register?token=${token}${invite.email ? `&email=${encodeURIComponent(invite.email)}` : ""}`}
          className="block w-full px-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Create your account →
        </Link>
        <p className="mt-4 text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
