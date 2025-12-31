import { ProseInlineAction } from "#i/core/actions/prose-inline-action";
import { Link } from "@remix-run/react";
import type { Options as ReactMarkdownOptions } from "react-markdown";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import gfm from "remark-gfm";

export type MarkdownComponents = NonNullable<
  ReactMarkdownOptions["components"]
>;

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
  br: (props) => <br {...withoutNode(props)} />,

  a: ({ children, href, title }) => {
    if (href == null) {
      return <span title={title}>children</span>;
    }

    return (
      <ProseInlineAction asChild>
        <Link to={href} title={title} prefetch="intent">
          {children}
        </Link>
      </ProseInlineAction>
    );
  },

  em: (props) => <em {...withoutNode(props)} />,

  strong: (props) => (
    <strong {...withoutNode(props)} className="text-body-lowercase-emphasis" />
  ),
};

export const PARAGRAPH_COMPONENTS: MarkdownComponents = {
  ...SENTENCE_COMPONENTS,

  p: (props) => (
    <p {...withoutNode(props)} className="my-2 first:mt-0 last:mb-0" />
  ),

  ul: (props) => (
    <ul
      {...withoutNode(props)}
      className="my-2 list-disc pl-[16px] first:mt-0 last:mb-0"
    />
  ),

  ol: (props) => (
    <ol
      {...withoutNode(props)}
      className="my-2 list-decimal pl-[16px] first:mt-0 last:mb-0"
    />
  ),

  li: (props) => <li {...withoutNode(props)} />,
};

const REMARK_PLUGINS: ReactMarkdownOptions["remarkPlugins"] = [
  // Allow line breaks in paragraphs.
  breaks,
  // Allow autolink literals, strikethrough, table and task list.
  gfm,
];

/**
 * Remove `node` from props object because we don't want to have
 * `node="[object Object]"` in the DOM.
 */
export function withoutNode<TProps extends Record<string, any>>({
  node,
  ...props
}: TProps): Omit<TProps, "node"> {
  return props;
}
