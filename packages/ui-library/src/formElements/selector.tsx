import cn from "classnames";
import * as React from "react";
import { Radio, RadioProps } from "./radio";

export function Selectors({
  className,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul {...rest} className={cn("flex", className)} />;
}

export function SelectorItem({
  className,
  ...rest
}: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li {...rest} className={cn("m-2 flex-1 min-w-0", className)} />;
}

export function Selector({
  className,
  children,
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const checked = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.props.checked
  );

  return (
    <label
      {...rest}
      children={children}
      className={cn(
        "cursor-pointer relative rounded h-20 min-w-0 px-2 flex flex-col items-center justify-center",
        {
          "border-2 border-blue-500 text-blue-500": checked,
          "border border-gray-400": !checked,
        },
        className
      )}
    />
  );
}

export function SelectorRadio({ className, ...rest }: RadioProps) {
  return (
    <span className={cn("absolute top-1 right-1 flex", className)}>
      <Radio {...rest} size="small" />
    </span>
  );
}

export function SelectorIcon({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span {...rest} className={cn("flex-none text-3xl", className)} />;
}

export function SelectorLabel({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      className={cn("flex-none max-w-full truncate text-xs", className)}
    />
  );
}
