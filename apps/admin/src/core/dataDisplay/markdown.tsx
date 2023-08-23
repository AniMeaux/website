import { ProseInlineAction } from "#core/actions.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import ReactMarkdown, { Options as ReactMarkdownOptions } from "react-markdown";
import breaks from "remark-breaks";
import gfm from "remark-gfm";

const REMARK_PLUGINS: ReactMarkdownOptions["plugins"] = [
  // Allow line breaks in paragraphs.
  breaks,
  // Allow autolink literals, strikethrough, table and task list.
  gfm,
];

type MarkdownProps = {
  children: string;
  components: NonNullable<ReactMarkdownOptions["components"]>;
  className?: string;
};

export function Markdown({ children, components, className }: MarkdownProps) {
  return (
    <ReactMarkdown
      // Keep the content of a disallowed elements.
      // If `strong` and `em` are disallowed:
      //   "This is a **bold** _move_" => "This is a bold move"
      unwrapDisallowed
      allowElement={(element) => {
        // Only allow elements defined in the `components`.
        return (
          components[element.tagName as keyof MarkdownProps["components"]] !=
          null
        );
      }}
      components={components}
      remarkPlugins={REMARK_PLUGINS}
      className={className}
    >
      {children}
    </ReactMarkdown>
  );
}

export const ARTICLE_COMPONENTS: MarkdownProps["components"] = {
  br: () => <br />,
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  strong: ({ children }) => (
    <strong className="text-body-emphasis">{children}</strong>
  ),
  em: ({ children }) => <em>{children}</em>,
  code: ({ children }) => (
    <code className="bg-gray-100 rounded-0.5 px-0.5 inline-flex text-code-default">
      {children}
    </code>
  ),
  a: ({ children, href, title }) => (
    <ProseInlineAction asChild>
      <BaseLink to={href} title={title}>
        {children}
      </BaseLink>
    </ProseInlineAction>
  ),
  ul: ({ children }) => (
    <ul className="my-2 pl-2 list-disc first:mt-0 last:mb-0">{children}</ul>
  ),
  ol: ({ children, start }) => (
    <ol start={start} className="my-2 pl-2 list-decimal first:mt-0 last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
};

export const HIGHLIGHT_COMPONENTS: MarkdownProps["components"] = {
  strong: ({ children }) => (
    <strong className="text-body-emphasis">{children}</strong>
  ),
};
