"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  Sun, Moon, Menu, X, PenSquare, LogOut, User, Settings, ChevronDown
} from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const role = (session?.user as { role?: string })?.role;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <img src="/favicon.svg" alt="MCB logo" className="w-12 h-12 invert" />
          <span className="hidden sm:inline text-foreground/70 text-sm font-normal">Mildly Concerning Behavior</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
            Home
          </Link>
          {role === "admin" && (
            <Link href="/admin" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          {session ? (
            <>
              {(role === "author" || role === "admin") && (
                <Link
                  href="/posts/new"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                >
                  <PenSquare size={14} />
                  Write
                </Link>
              )}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">
                    {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <ChevronDown size={12} className="text-muted-foreground" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 rounded-md border border-border bg-card shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium truncate">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href={`/profile/${session.user?.name?.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={14} />
                      Profile
                    </Link>
                    {(role === "author" || role === "admin") && (
                      <Link
                        href="/posts/new"
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors sm:hidden"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <PenSquare size={14} />
                        Write a post
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                Get started
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card/95 px-4 py-3 space-y-2">
          <Link href="/" className="block py-2 text-sm hover:text-primary" onClick={() => setMobileOpen(false)}>Home</Link>
          {role === "admin" && (
            <Link href="/admin" className="block py-2 text-sm hover:text-primary" onClick={() => setMobileOpen(false)}>Admin</Link>
          )}
          {!session && (
            <>
              <Link href="/login" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link href="/register" className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
