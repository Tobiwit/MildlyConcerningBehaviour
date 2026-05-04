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
          width: "60vw",
          height: "60vw",
          top: "-20%",
          left: "-15%",
          backgroundColor: "hsl(var(--blob-1) / 0.65)",
          "--blob-duration": "10s",
        } as React.CSSProperties}
      />
      <div
        className="blob"
        style={{
          width: "55vw",
          height: "55vw",
          top: "20%",
          right: "-20%",
          backgroundColor: "hsl(var(--blob-2) / 0.60)",
          "--blob-duration": "14s",
          animationDelay: "-4s",
        } as React.CSSProperties}
      />
      <div
        className="blob"
        style={{
          width: "50vw",
          height: "50vw",
          bottom: "-15%",
          left: "20%",
          backgroundColor: "hsl(var(--blob-3) / 0.55)",
          "--blob-duration": "18s",
          animationDelay: "-8s",
        } as React.CSSProperties}
      />
      <div
        className="blob"
        style={{
          width: "35vw",
          height: "35vw",
          top: "55%",
          left: "-5%",
          backgroundColor: "hsl(var(--blob-4) / 0.50)",
          "--blob-duration": "20s",
          animationDelay: "-13s",
        } as React.CSSProperties}
      />
      <div
        className="absolute inset-0"
        style={{ background: "hsl(var(--background) / 0.55)" }}
      />
    </div>
  );
}
