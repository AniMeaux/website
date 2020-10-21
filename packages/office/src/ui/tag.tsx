import cn from "classnames";
import * as React from "react";
import { Placeholder, Placeholders } from "./loaders/placeholder";

export function TagList({
  className,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul {...rest} className={cn("flex flex-wrap", className)} />;
}

export function TagListPlaceholder({
  className,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul {...rest} className={cn("flex flex-wrap", className)}>
      <Placeholders count={5}>
        <TagListItem>
          <Placeholder preset="tag" />
        </TagListItem>
      </Placeholders>
    </ul>
  );
}

export function TagListItem({
  className,
  ...rest
}: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li {...rest} className={cn("p-1 max-w-full", className)} />;
}

export function Tag({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      className={cn(
        "h-8 rounded-full bg-gray-100 px-4 flex items-center text-sm space-x-2",
        className
      )}
    />
  );
}

type TagIconProps = {
  children: React.ReactElement;
  className?: string;
};

export function TagIcon({ className, children }: TagIconProps) {
  return React.cloneElement(children, {
    className: cn(
      children.props.className,
      "flex-none text-gray-700",
      className
    ),
  });
}

export function TagText({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...rest} className={cn("truncate", className)} />;
}
