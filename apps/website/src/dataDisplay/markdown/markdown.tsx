import cn from "classnames";
import { Link } from "~/core/link";
import { StyleProps } from "~/core/types";
import { StaticImage } from "~/dataDisplay/image";
import { ElementType } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import ReactMarkdown, { Options as ReactMarkdownOptions } from "react-markdown";
import breaks from "remark-breaks";
import gfm from "remark-gfm";
import slug from "remark-slug";
import styles from "./markdown.module.css";

const Heading: NonNullable<ReactMarkdownOptions["components"]>["h1"] = ({
  id,
  children,
  level,
  key,
}) => {
  const Component = `h${level}` as ElementType;

  return (
    <Component id={id} key={key}>
      <Link href={`#${id as string}`}>{children}</Link>
    </Component>
  );
};

export type MarkdownPreset = "article" | "paragraph";

const PresetOptions: Record<MarkdownPreset, Partial<ReactMarkdownOptions>> = {
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
        img: ({ src, alt, key }) => {
          return (
            <StaticImage
              key={key}
              largeImage={src as string}
              smallImage={src as string}
              alt={alt as string}
            />
          );
        },
        blockquote: ({ children, key }) => {
          return (
            <blockquote key={key}>
              <FaQuoteLeft />
              <div>{children}</div>
            </blockquote>
          );
        },
        a: ({ children, href, key }) => {
          return (
            <Link key={key} href={href as string}>
              {children}
            </Link>
          );
        },
      }}
    />
  );
}
