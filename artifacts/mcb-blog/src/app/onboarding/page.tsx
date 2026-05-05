"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFinish() {
    setLoading(true);
    const userId = (session?.user as { id?: string })?.id;
    if (bio.trim() && userId) {
      await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: bio.trim() }),
      });
      await update();
    }
    router.push("/");
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="glass rounded-3xl px-8 py-10 max-w-md w-full">
        <div className="mb-8">
          <p className="text-4xl mb-4">🎉</p>
          <h1 className="text-2xl font-black mb-2">Welcome to the chaos</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You&apos;re in. Tell the room something mildly concerning about yourself — or skip and start reading.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold block mb-1.5">
              A little about you <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="Amateur risk assessor. Definitely fine."
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-shadow"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">{bio.length}/200</p>
          </div>

          <button
            onClick={handleFinish}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Enter the blog
          </button>

          <button
            onClick={() => router.push("/")}
            disabled={loading}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
