import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

const sanitizeSchema = {
  allowedTags: ["h2", "h3", "strong", "em", "ul", "ol", "li", "p", "code"],
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
      components={{
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mt-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-medium mt-1">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 flex flex-col gap-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 flex flex-col gap-1">{children}</ol>
        ),
        li: ({ children }) => <li className="text-sm">{children}</li>,
        p: ({ children }) => (
          <p className="text-sm leading-relaxed">{children}</p>
        ),
        code: ({ children }) => (
          <code className="bg-[var(--panel)] text-sm font-mono px-1 py-0.5 rounded border border-[var(--line)]">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
