"use client";

export function BlobBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div
        className="blob"
        style={{
          width: "55vw",
          height: "55vw",
          top: "-18%",
          left: "-12%",
          backgroundColor: "hsl(var(--blob-1) / 0.45)",
          "--blob-duration": "12s",
        } as React.CSSProperties}
      />
      <div
        className="blob"
        style={{
          width: "50vw",
          height: "50vw",
          top: "25%",
          right: "-16%",
          backgroundColor: "hsl(var(--blob-2) / 0.40)",
          "--blob-duration": "16s",
          animationDelay: "-5s",
        } as React.CSSProperties}
      />
      <div
        className="blob"
        style={{
          width: "45vw",
          height: "45vw",
          bottom: "-12%",
          left: "22%",
          backgroundColor: "hsl(var(--blob-3) / 0.38)",
          "--blob-duration": "20s",
          animationDelay: "-9s",
        } as React.CSSProperties}
      />
      <div
        className="blob"
        style={{
          width: "32vw",
          height: "32vw",
          top: "58%",
          left: "-4%",
          backgroundColor: "hsl(var(--blob-4) / 0.32)",
          "--blob-duration": "22s",
          animationDelay: "-14s",
        } as React.CSSProperties}
      />
      <div
        className="absolute inset-0"
        style={{ background: "hsl(var(--background) / 0.60)" }}
      />
    </div>
  );
}
