import cn from "classnames";
import * as React from "react";

type CenteredContentProps = {
  children: React.ReactElement;
};

export function CenteredContent({ children }: CenteredContentProps) {
  return React.cloneElement(children, {
    className: cn("CenteredContent", children.props.className),
  });
}
