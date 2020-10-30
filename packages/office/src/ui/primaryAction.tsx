import { Link, LinkProps } from "@animeaux/shared";
import cn from "classnames";
import * as React from "react";

const CLASS_NAMES =
  "a11y-focus fixed right-4 w-12 h-12 rounded-full bg-blue-500 text-white text-xl flex items-center justify-center";

export function PrimaryActionLink({ className, ...rest }: LinkProps) {
  return (
    <Link
      {...rest}
      className={cn(CLASS_NAMES, "bottom-20 md:bottom-4", className)}
    />
  );
}

export function AsidePrimaryActionLink({ className, ...rest }: LinkProps) {
  return <Link {...rest} className={cn(CLASS_NAMES, "bottom-4", className)} />;
}
