import cn from "classnames";
import { cloneElement } from "react";
import { StyleProps } from "~/core/types";

type CenteredContentProps = StyleProps & {
  children: React.ReactElement;
};

export function CenteredContent({ children, className }: CenteredContentProps) {
  return cloneElement(children, {
    className: cn("CenteredContent", className, children.props.className),
  });
}
