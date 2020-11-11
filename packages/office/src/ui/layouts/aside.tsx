import cn from "classnames";
import * as React from "react";

export function AsideLayout({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside
      {...rest}
      className={cn(
        "z-40 fixed md:static top-0 left-0 w-full md:w-5/12 md:min-w-0 h-screen md:h-auto md:min-h-0 md:flex-none md:border-l bg-white flex flex-col",
        className
      )}
    />
  );
}

export function Aside({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "min-h-0 flex-1 overflow-auto pt-4 pb-32 md:pb-20",
        className
      )}
    />
  );
}
