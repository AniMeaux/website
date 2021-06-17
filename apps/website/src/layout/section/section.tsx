import cn from "classnames";
import { StyleProps } from "core/types";
import { cloneElement } from "react";

type SectionProps = StyleProps & {
  children: React.ReactElement;
};

export function Section({ children, className }: SectionProps) {
  return cloneElement(children, {
    className: cn("Section", className, children.props.className),
  });
}
