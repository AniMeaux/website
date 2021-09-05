import { StyleProps } from "core/types";
import ReactMarkdown, { ReactMarkdownOptions } from "react-markdown";
import breaks from "remark-breaks";
import styled from "styled-components/macro";
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
    },
  },
};

const Paragraph = styled.p`
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
