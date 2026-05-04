"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialHasLiked: boolean;
}

export function LikeButton({ postId, initialCount, initialHasLiked }: LikeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setHasLiked(data.liked);
        setCount(data.count);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        hasLiked
          ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
          : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
      } disabled:opacity-60`}
    >
      <Heart size={15} className={hasLiked ? "fill-red-500" : ""} />
      <span>{count}</span>
    </button>
  );
}
