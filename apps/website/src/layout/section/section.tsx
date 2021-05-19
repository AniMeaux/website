import cn from "classnames";
import { cloneElement } from "react";
import { StyleProps } from "~/core/types";

type SectionProps = StyleProps & {
  children: React.ReactElement;
};

export function Section({ children, className }: SectionProps) {
  return cloneElement(children, {
    className: cn("Section", className, children.props.className),
  });
}
