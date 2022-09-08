import ReactMarkdown, { Options as ReactMarkdownOptions } from "react-markdown";
import breaks from "remark-breaks";
import gfm from "remark-gfm";

const REMARK_PLUGINS: ReactMarkdownOptions["plugins"] = [
  // Allow line breaks in paragraphs.
  breaks,
  // Allow autolink literals, strikethrough, table and task list.
  gfm,
];

export type MarkdownProps = {
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
