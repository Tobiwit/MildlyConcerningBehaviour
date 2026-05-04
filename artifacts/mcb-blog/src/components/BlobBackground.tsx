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
          top: "-15%",
          left: "-10%",
          backgroundColor: "hsl(var(--blob-1) / 0.35)",
          "--blob-duration": "14s",
        } as React.CSSProperties}
      />
      <div
        className="blob"
        style={{
          width: "50vw",
          height: "50vw",
          top: "30%",
          right: "-15%",
          backgroundColor: "hsl(var(--blob-2) / 0.28)",
          "--blob-duration": "18s",
          animationDelay: "-6s",
        } as React.CSSProperties}
      />
      <div
        className="blob"
        style={{
          width: "45vw",
          height: "45vw",
          bottom: "-10%",
          left: "25%",
          backgroundColor: "hsl(var(--blob-3) / 0.25)",
          "--blob-duration": "22s",
          animationDelay: "-10s",
        } as React.CSSProperties}
      />
      <div
        className="absolute inset-0"
        style={{ backdropFilter: "blur(0px)", background: "hsl(var(--background) / 0.7)" }}
      />
    </div>
  );
}
