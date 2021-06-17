import cn from "classnames";
import { Link } from "core/link";
import { StyleProps } from "core/types";
import { UnknownImage } from "dataDisplay/image";
import { ElementType } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import ReactMarkdown, { FilterOptions } from "react-markdown";
import type { HeadingComponent } from "react-markdown/src/ast-to-react";
import breaks from "remark-breaks";
import gfm from "remark-gfm";
import slug from "remark-slug";
import styles from "./markdown.module.css";

const Heading: HeadingComponent = ({ id, children, level }) => {
  const Component = `h${level}` as ElementType;

  return (
    <Component id={id}>
      <Link href={`#${id as string}`}>{children}</Link>
    </Component>
  );
};

export type MarkdownPreset = "article" | "paragraph";

const PresetOptions: Record<MarkdownPreset, FilterOptions> = {
  article: {},
  paragraph: {
    allowedElements: [
      "a",
      "br",
      "code",
      "del",
      "em",
      "input",
      "li",
      "ol",
      "p",
      "strong",
      "ul",
    ],
    unwrapDisallowed: true,
  },
};

type MarkdownProps = StyleProps & {
  preset: MarkdownPreset;
  children: string;
};

export function Markdown({ preset, className, ...props }: MarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      {...PresetOptions[preset]}
      className={cn(styles.markdown, className)}
      remarkPlugins={[
        // Add anchors headings using GitHub’s algorithm.
        // Required by headings.
        slug,
        // Allow line breaks in paragraphs.
        breaks,
        // Allow autolink literals, strikethrough, table and task list.
        gfm,
      ]}
      components={{
        h1: Heading,
        h2: Heading,
        h3: Heading,
        h4: Heading,
        h5: Heading,
        h6: Heading,
        img: ({ src, alt }) => {
          return <UnknownImage src={src as string} alt={alt as string} />;
        },
        blockquote: ({ children }) => {
          return (
            <blockquote>
              <FaQuoteLeft />
              <div>{children}</div>
            </blockquote>
          );
        },
        a: ({ children, href }) => {
          return <Link href={href as string}>{children}</Link>;
        },
      }}
    />
  );
}
