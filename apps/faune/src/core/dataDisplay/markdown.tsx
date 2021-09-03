import cn from "classnames";
import { StyleProps } from "core/types";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";

type MarkdownProps = StyleProps & {
  children: string;
};

export function Markdown({ className, children, ...props }: MarkdownProps) {
  return (
    <div {...props} className={cn("Markdown", className)}>
      <ReactMarkdown
        plugins={[
          // Allow line breaks in paragraphs.
          breaks,
        ]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

type MarkdownInlineProps = StyleProps & {
  children: string;
};

export function MarkdownInline({ children, ...rest }: MarkdownInlineProps) {
  return (
    <ReactMarkdown {...rest} allowedElements={["strong"]} unwrapDisallowed>
      {children}
    </ReactMarkdown>
  );
}
