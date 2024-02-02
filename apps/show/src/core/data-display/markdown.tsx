import { ProseInlineAction } from "#core/actions";
import { Link } from "@remix-run/react";
import type { Options as ReactMarkdownOptions } from "react-markdown";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import gfm from "remark-gfm";

type MarkdownComponents = NonNullable<ReactMarkdownOptions["components"]>;

export function Markdown({
  content,
  components,
  className,
}: {
  content: string;
  components: MarkdownComponents;
  className?: string;
}) {
  return (
    <ReactMarkdown
      // Keep the content of a disallowed elements.
      // If `strong` and `em` are disallowed:
      //   "This is a **bold** _move_" => "This is a bold move"
      unwrapDisallowed
      allowElement={(element) => {
        // Only allow elements defined in the `components`.
        return components[element.tagName as keyof MarkdownComponents] != null;
      }}
      components={components}
      remarkPlugins={REMARK_PLUGINS}
      className={className}
    >
      {content}
    </ReactMarkdown>
  );
}

export const SENTENCE_COMPONENTS: MarkdownComponents = {
  a: ({ children, href, title }) => {
    if (href == null) {
      return <span title={title}>children</span>;
    }

    return (
      <ProseInlineAction asChild>
        <Link to={href} title={title}>
          {children}
        </Link>
      </ProseInlineAction>
    );
  },

  em: ({ children }) => <em>{children}</em>,

  strong: ({ children }) => (
    <strong className="text-body-lowercase-emphasis">{children}</strong>
  ),
};

const REMARK_PLUGINS: ReactMarkdownOptions["remarkPlugins"] = [
  // Allow line breaks in paragraphs.
  breaks,
  // Allow autolink literals, strikethrough, table and task list.
  gfm,
];
