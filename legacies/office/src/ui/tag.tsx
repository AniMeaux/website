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

type TagSize = "small" | "large";
type TagColor = "gray" | "blue" | "white";

const TagSizeClassNames: { [key in TagSize]: string } = {
  large: "h-10 space-x-2",
  small: "h-8 text-sm space-x-2",
};

const TagColorClassNames: { [key in TagColor]: string } = {
  blue: "bg-blue-100 text-blue-500",
  gray: "bg-gray-100",
  white: "bg-white",
};

type TagProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: TagSize;
  color?: TagColor;
};

export function Tag({
  size = "small",
  color = "gray",
  className,
  ...rest
}: TagProps) {
  return (
    <span
      {...rest}
      className={cn(
        "rounded-full px-4 flex items-center",
        TagSizeClassNames[size],
        TagColorClassNames[color],
        className
      )}
    />
  );
}

export function TagIcon({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...rest} className={cn("flex-none", className)} />;
}

export function TagText({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...rest} className={cn("truncate", className)} />;
}
