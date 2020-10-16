import cn from "classnames";
import * as React from "react";

export function PrimaryAction({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        "fixed bottom-20 right-4 w-12 h-12 rounded-full bg-blue-500 text-white text-xl flex items-center justify-center",
        className
      )}
    />
  );
}
