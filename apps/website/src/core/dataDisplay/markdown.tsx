import { actionClassNames } from "#core/actions.ts";
import { BaseLink } from "#core/baseLink.tsx";
import type { Config } from "#core/config.ts";
import { useConfig } from "#core/config.ts";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import { LineShapeVertical } from "#core/layout/lineShape.tsx";
import { cn } from "@animeaux/core";
import type { Options as ReactMarkdownOptions } from "react-markdown";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import gfm from "remark-gfm";
import invariant from "tiny-invariant";

const REMARK_PLUGINS: ReactMarkdownOptions["remarkPlugins"] = [
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

export enum MarkdownLink {
  PICK_UP_FORM = "PICK_UP_FORM",
  FACEBOOK = "FACEBOOK",
}

const LINK_TO_CONFIG_KEY: Record<MarkdownLink, keyof Config> = {
  [MarkdownLink.PICK_UP_FORM]: "pickUpFormUrl",
  [MarkdownLink.FACEBOOK]: "facebookUrl",
};

export const ARTICLE_COMPONENTS: MarkdownProps["components"] = {
  br: () => <br />,
  em: ({ children }) => <em>{children}</em>,
  strong: ({ children }) => (
    <strong className="text-body-emphasis">{children}</strong>
  ),
  p: ({ children }) => <p className="my-6 first:mt-0 last:mb-0">{children}</p>,
  img: ({ src, alt }) => {
    invariant(src != null, "src should be defined");
    invariant(alt != null, "alt should be defined");

    return (
      <DynamicImage
        imageId={src}
        alt={alt}
        sizes={{ lg: "1024px", default: "100vw" }}
        fallbackSize="1024"
        className={cn(
          "my-12 aspect-4/3 w-full flex-none rounded-bubble-md",
          "sm:rounded-bubble-lg",
          "md:rounded-bubble-xl",
        )}
      />
    );
  },
  blockquote: ({ children }) => (
    <blockquote
      className={cn("my-6 flex gap-3 italic first:mt-0 last:mb-0", "md:gap-6")}
    >
      <LineShapeVertical className="w-2 flex-none text-brandBlue" />
      <div className="flex-1">{children}</div>
    </blockquote>
  ),
  a: function A({ children, href }) {
    const config = useConfig();
    const configKey = LINK_TO_CONFIG_KEY[href as MarkdownLink];

    return (
      <BaseLink
        to={configKey == null ? href : config[configKey]}
        className={actionClassNames.proseInline()}
      >
        {children}
      </BaseLink>
    );
  },
  h2: ({ children }) => (
    <h2
      className={cn(
        "mb-6 mt-12 text-title-section-small first:mt-0 last:mb-0",
        "md:text-title-section-large",
      )}
    >
      {children}
    </h2>
  ),
  ul: ({ children }) => (
    <ul className="my-6 list-disc pl-4 first:mt-0 last:mb-0">{children}</ul>
  ),
  ol: ({ children, start }) => (
    <ol start={start} className="my-6 list-decimal pl-4 first:mt-0 last:mb-0">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  table: ({ children }) => (
    <table className="my-6 block w-full overflow-auto first:mt-0 last:mb-0">
      {children}
    </table>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children, style }) => (
    <th
      className="border border-gray-200 px-6 py-3 text-body-emphasis"
      style={style}
    >
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td className="border border-gray-200 px-6 py-3" style={style}>
      {children}
    </td>
  ),
};
