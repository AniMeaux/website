import { ProseInlineAction } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import type { Options as ReactMarkdownOptions } from "react-markdown";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import gfm from "remark-gfm";

export type MarkdownComponents = NonNullable<
  ReactMarkdownOptions["components"]
>;

export function Markdown({
  children,
  components,
  className,
}: {
  children: string;
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
      {children}
    </ReactMarkdown>
  );
}

export const HIGHLIGHT_COMPONENTS: MarkdownComponents = {
  strong: (props) => (
    <strong {...withoutNode(props)} className="text-body-emphasis" />
  ),
};

export const SENTENCE_COMPONENTS: MarkdownComponents = {
  ...HIGHLIGHT_COMPONENTS,

  br: (props) => <br {...withoutNode(props)} />,

  em: (props) => <em {...withoutNode(props)} />,

  a: ({ children, href, title }) => (
    <ProseInlineAction asChild>
      <BaseLink to={href} title={title}>
        {children}
      </BaseLink>
    </ProseInlineAction>
  ),
};

export const ARTICLE_COMPONENTS: MarkdownComponents = {
  ...SENTENCE_COMPONENTS,

  p: (props) => (
    <p {...withoutNode(props)} className="my-2 first:mt-0 last:mb-0" />
  ),

  ul: (props) => (
    <ul
      {...withoutNode(props)}
      className="my-2 list-disc pl-2 first:mt-0 last:mb-0"
    />
  ),

  ol: (props) => (
    <ol
      {...withoutNode(props)}
      className="my-2 list-decimal pl-2 first:mt-0 last:mb-0"
    />
  ),

  li: (props) => <li {...withoutNode(props)} />,

  code: (props) => (
    <code
      {...withoutNode(props)}
      className="inline-flex rounded-0.5 bg-gray-100 px-0.5 text-code-default"
    />
  ),
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
function withoutNode<TProps extends Record<string, any>>({
  node,
  ...props
}: TProps): Omit<TProps, "node"> {
  return props;
}
