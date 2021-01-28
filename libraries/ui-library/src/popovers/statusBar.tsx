import cn from "classnames";
import * as React from "react";
import { MessageType, MessageTypeClassName } from "../message";

type StatusBarProps = React.HTMLAttributes<HTMLDivElement> & {
  type: MessageType;
};

export function StatusBar({ type, ...rest }: StatusBarProps) {
  return (
    <p
      {...rest}
      className={cn(
        "z-40 fixed top-0 left-0 right-0 text-xs flex items-center justify-center pointer-events-none",
        MessageTypeClassName[type]
      )}
    />
  );
}
