"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold mt-5 mb-2">{children}</h3>,
        p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>,
        a: ({ href, children }) => (
          <a href={href} className="text-primary underline hover:opacity-80" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-primary/50">{children}</strong>
        ),
        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-foreground/90">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground">
            {children}
          </blockquote>
        ),
        code: ({ className, children, ...props }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto mb-4 text-sm">
                <code className={className}>{children}</code>
              </pre>
            );
          }
          return (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props}>
              {children}
            </code>
          );
        },
        img: ({ src, alt }) => (
          <img src={src} alt={alt} className="rounded-lg max-w-full my-4" />
        ),
        hr: () => <hr className="border-border my-6" />,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border border-border rounded-lg text-sm">{children}</table>
          </div>
        ),
        th: ({ children }) => <th className="px-4 py-2 bg-muted font-semibold text-left border-b border-border">{children}</th>,
        td: ({ children }) => <td className="px-4 py-2 border-b border-border">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
