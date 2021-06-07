import cn from "classnames";
import { ChildrenProp, StyleProps } from "core/types";

type SectionTitleProps = StyleProps & ChildrenProp;
export function SectionTitle({ className, ...rest }: SectionTitleProps) {
  return (
    // The content is passed as children.
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h2 {...rest} className={cn("SectionTitle", className)} />
  );
}

type SectionProps = StyleProps & ChildrenProp;
export function Section({ className, ...rest }: SectionProps) {
  return <section {...rest} className={cn("Section", className)} />;
}

export function ButtonSection({ className, ...rest }: SectionProps) {
  return <section {...rest} className={cn("ButtonSection", className)} />;
}

export function SectionBox({ className, ...rest }: SectionProps) {
  return <Section {...rest} className={cn("SectionBox", className)} />;
}
