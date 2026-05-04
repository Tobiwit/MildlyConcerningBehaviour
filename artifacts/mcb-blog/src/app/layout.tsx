import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BlobBackground } from "@/components/BlobBackground";
import { Navbar } from "@/components/Navbar";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "Mildly Concerning Behavior",
    template: "%s | Mildly Concerning Behavior",
  },
  description: "A multi-author blogging platform for mildly concerning thoughts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <BlobBackground />
            <Navbar />
            <main className="min-h-[calc(100vh-56px)]">{children}</main>
            <footer className="border-t border-border py-8 mt-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>&copy; 2026 Mildly Concerning Behavior</p>
                <div className="flex gap-4">
                  <a href="/" className="hover:text-foreground transition-colors">Home</a>
                  <a href="/admin" className="hover:text-foreground transition-colors">Admin</a>
                </div>
              </div>
            </footer>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
