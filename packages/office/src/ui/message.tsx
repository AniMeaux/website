import cn from "classnames";
import * as React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

type MessageType = "error" | "success";

type MessageProps = React.HTMLAttributes<HTMLSpanElement> & {
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
        "px-4 py-2 rounded-lg text-sm font-medium flex items-start",
        {
          "bg-red-50 text-red-500": type === "error",
          "bg-green-50 text-green-500": type === "success",
        },
        className
      )}
    >
      <Icon className="mr-4 text-xl" />
      <p className="flex-1">{children}</p>
    </div>
  );
}
