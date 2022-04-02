import { StyleProps } from "core/types";
import ReactMarkdown, { Options as ReactMarkdownOptions } from "react-markdown";
import breaks from "remark-breaks";
import styled from "styled-components";
import { theme } from "styles/theme";

type MarkdownPreset = "inline" | "paragraph";

const PRESET_OPTIONS: Record<
  MarkdownPreset,
  Omit<ReactMarkdownOptions, "children">
> = {
  inline: {
    allowedElements: ["strong"],
    unwrapDisallowed: true,
  },
  paragraph: {
    plugins: [
      // Allow line breaks in paragraphs.
      breaks,
    ],
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
    components: {
      p: (props) => <Paragraph {...props} />,
      ul: (props) => <UnorderedList {...props} />,
      ol: (props) => <OrderedList {...props} />,
    },
  },
};

const Paragraph = styled.p`
  &:not(:first-child) {
    margin-top: ${theme.spacing.x2};
  }
`;

const UnorderedList = styled.ul`
  list-style: disc;
  padding-left: ${theme.spacing.x6};

  &:not(:first-child) {
    margin-top: ${theme.spacing.x2};
  }
`;

const OrderedList = styled.ul`
  list-style: decimal;
  padding-left: ${theme.spacing.x6};

  &:not(:first-child) {
    margin-top: ${theme.spacing.x2};
  }
`;

type MarkdownProps = StyleProps & {
  preset: MarkdownPreset;
  children: string;
};

export function Markdown({ preset, ...reset }: MarkdownProps) {
  return <ReactMarkdown {...reset} {...PRESET_OPTIONS[preset]} />;
}
