import cn from "classnames";
import ReactMarkdown from "react-markdown";
import breaks from "remark-breaks";
import { StyleProps } from "~/core/types";
import styles from "./markdown.module.css";

type MarkdownProps = StyleProps & {
  children: string;
};

export function Markdown(props: MarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      plugins={[
        // Allow line breaks in paragraphs.
        breaks,
      ]}
      components={{
        p: ({ node, className, ...rest }) => (
          <p {...rest} className={cn(styles.p, className)} />
        ),
      }}
    />
  );
}
