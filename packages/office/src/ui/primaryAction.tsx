import { Link, LinkProps } from "@animeaux/shared";
import cn from "classnames";
import * as React from "react";

const CLASS_NAMES =
  "fixed bottom-20 md:bottom-4 right-4 w-12 h-12 rounded-full bg-blue-500 text-white text-xl flex items-center justify-center";

export function PrimaryAction({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...rest} className={cn(CLASS_NAMES, className)} />;
}

export function PrimaryActionLink({ className, ...rest }: LinkProps) {
  return <Link {...rest} className={cn(CLASS_NAMES, className)} />;
}
