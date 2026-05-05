"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

interface Props {
  inviteToken?: string;
  inviteEmail?: string;
}

export function RegisterForm({ inviteToken, inviteEmail }: Props) {
  const router = useRouter();
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [resolvedEmail, setResolvedEmail] = useState(inviteEmail || "");
  const [form, setForm] = useState({
    name: "",
    email: inviteEmail || "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inviteToken) {
      setValidating(false);
      setTokenValid(false);
      return;
    }
    fetch(`/api/invites/validate?token=${encodeURIComponent(inviteToken)}`)
      .then((r) => r.json())
      .then((data) => {
        setTokenValid(data.valid);
        if (data.valid && data.email) {
          setResolvedEmail(data.email);
          setForm((f) => ({ ...f, email: data.email }));
        }
      })
      .catch(() => setTokenValid(false))
      .finally(() => setValidating(false));
  }, [inviteToken]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          token: inviteToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/onboarding");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (validating) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
        <div className="glass rounded-3xl px-8 py-10 max-w-sm w-full text-center">
          <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={40} />
          <h1 className="text-xl font-black mb-2">Invite-only community</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {inviteToken
              ? "This invite link is invalid or has already been used."
              : "You need a valid invite link to create an account."}
          </p>
          <Link
            href="/login"
            className="text-sm text-primary hover:underline font-medium"
          >
            Sign in instead →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground">You&apos;ve been invited — welcome</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-semibold">Display name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                readOnly={!!resolvedEmail}
                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow disabled:opacity-60 read-only:opacity-70 read-only:cursor-not-allowed"
              />
              {resolvedEmail && (
                <p className="text-xs text-muted-foreground">This invite is tied to this email address.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-3 py-2 pr-10 text-sm rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm" className="text-sm font-semibold">Confirm password</label>
              <input
                id="confirm"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Create account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
