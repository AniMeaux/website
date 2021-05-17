import cn from "classnames";
import { ElementType } from "react";
import ReactMarkdown, { FilterOptions } from "react-markdown";
import type { HeadingComponent } from "react-markdown/src/ast-to-react";
import breaks from "remark-breaks";
import gfm from "remark-gfm";
import slug from "remark-slug";
import { Link } from "~/core/link";
import { StyleProps } from "~/core/types";
import styles from "./markdown.module.css";

export type MarkdownPreset = "article" | "paragraph";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
const HeadingLevelComponent: Record<HeadingLevel, ElementType> = {
  "1": "h1",
  "2": "h2",
  "3": "h3",
  "4": "h4",
  "5": "h5",
  "6": "h6",
};

const HeadingLevelClassName: Record<HeadingLevel, string> = {
  "1": styles.h1,
  "2": styles.h2,
  "3": styles.h3,
  "4": styles.h4,
  "5": styles.h5,
  "6": styles.h6,
};

const Heading: HeadingComponent = ({ id, children, level }) => {
  const headingLevel = level as HeadingLevel;
  const Component = HeadingLevelComponent[headingLevel];

  return (
    <Component
      id={id}
      className={cn(styles.heading, HeadingLevelClassName[headingLevel])}
    >
      <Link href={`#${id as string}`} className={styles.headingLink}>
        {children}
      </Link>
    </Component>
  );
};

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

export function Markdown({ preset, ...props }: MarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      {...PresetOptions[preset]}
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
        p: ({ node, className, ...rest }) => {
          return <p {...rest} className={cn(styles.p, className)} />;
        },
        a: ({ children, href }) => {
          return (
            <Link href={href as string} className={styles.a}>
              {children}
            </Link>
          );
        },
      }}
    />
  );
}
