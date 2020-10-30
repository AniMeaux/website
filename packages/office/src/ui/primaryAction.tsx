import { Link, LinkProps } from "@animeaux/shared";
import cn from "classnames";
import * as React from "react";

export function PrimaryActionLink({ className, ...rest }: LinkProps) {
  return (
    <Link
      {...rest}
      className={cn(
        "a11y-focus shadow-md fixed bottom-20 md:bottom-4 right-4 w-12 h-12 rounded-full bg-blue-500 text-white text-xl flex items-center justify-center",
        className
      )}
    />
  );
}
