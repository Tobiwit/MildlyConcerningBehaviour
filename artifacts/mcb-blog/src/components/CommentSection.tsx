"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Send, Trash2, Loader2 } from "lucide-react";
import type { Session } from "next-auth";

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  author: { id: string; name: string; avatar: string | null };
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  session: Session | null;
}

export function CommentSection({ postId, comments: initial, session }: CommentSectionProps) {
  const router = useRouter();
  const [comments, setComments] = useState(initial);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = session?.user?.id;
  const role = (session?.user as { role?: string })?.role;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments([data, ...comments]);
        setContent("");
      } else {
        setError(data.error || "Failed to post comment.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(commentId: string) {
    const res = await fetch(`/api/posts/${postId}/comments?commentId=${commentId}`, { method: "DELETE" });
    if (res.ok) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold mb-5">Comments ({comments.length})</h2>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 mt-0.5">
              {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your mildly concerning thoughts..."
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
              />
              {error && <p className="text-xs text-destructive mt-1">{error}</p>}
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-lg border border-border bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">Sign in</Link>
            {" "}to join the conversation.
          </p>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 mt-0.5">
                {comment.author.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  {(userId === comment.author.id || role === "admin") && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
