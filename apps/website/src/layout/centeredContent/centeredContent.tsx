import cn from "classnames";
import { StyleProps } from "core/types";
import { cloneElement } from "react";

type CenteredContentProps = StyleProps & {
  children: React.ReactElement;
};

export function CenteredContent({ children, className }: CenteredContentProps) {
  return cloneElement(children, {
    className: cn("CenteredContent", className, children.props.className),
  });
}
