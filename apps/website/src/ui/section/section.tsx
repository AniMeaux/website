import { StyleProps } from "@animeaux/ui-library/build/core/types";
import cn from "classnames";
import * as React from "react";

type SectionProps = StyleProps & {
  children: React.ReactElement;
};

export function Section({ children, className }: SectionProps) {
  return React.cloneElement(children, {
    className: cn("Section", className, children.props.className),
  });
}
