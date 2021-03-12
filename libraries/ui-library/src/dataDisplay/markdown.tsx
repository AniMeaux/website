import * as React from "react";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import { StyleProps } from "../core";

type MarkdownProps = StyleProps & {
  children: string;
};

export function Markdown(props: MarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      plugins={[
        // Allow line breaks in paragraphs.
        breaks,
      ]}
    />
  );
}
