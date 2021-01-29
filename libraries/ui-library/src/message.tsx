import cn from "classnames";
import * as React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

export type MessageType = "error" | "success";

export const MessageTypeClassName: { [key in MessageType]: string } = {
  error: "bg-red-500 text-white",
  success: "bg-green-500 text-white",
};

type MessageProps = React.HTMLAttributes<HTMLDivElement> & {
  type: MessageType;
};

const IconType: { [key in MessageType]: React.ElementType } = {
  error: FaTimes,
  success: FaCheck,
};

export function Message({ type, children, className, ...rest }: MessageProps) {
  const Icon = IconType[type];

  return (
    <div
      {...rest}
      className={cn(
        "px-4 py-4 rounded-lg text-sm font-medium flex items-start",
        MessageTypeClassName[type],
        className
      )}
    >
      <Icon className="mr-4 flex-none text-xl" />
      <p className="flex-1">{children}</p>
    </div>
  );
}
