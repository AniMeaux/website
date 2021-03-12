import * as React from "react";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";

type MarkdownProps = {
  children: string;
};

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      plugins={[
        // Allow line breaks in paragraphs.
        breaks,
      ]}
    >
      {children}
    </ReactMarkdown>
  );
}
