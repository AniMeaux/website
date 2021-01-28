import cn from "classnames";
import * as React from "react";
import { Checkbox, CheckboxProps } from "./checkbox";
import { Radio, RadioProps } from "./radio";

export function Selectors({
  className,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul {...rest} className={cn("flex flex-wrap", className)} />;
}

type SelectorItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
  itemsCount: number;
};

export function SelectorItem({
  itemsCount,
  className,
  style,
  ...rest
}: SelectorItemProps) {
  return (
    <li
      {...rest}
      className={cn("p-2 flex-none", className)}
      style={{ ...style, width: `${100 / Math.min(3, itemsCount)}%` }}
    />
  );
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
        "cursor-pointer relative rounded h-20 min-w-0 ring-inset px-2 flex flex-col items-center justify-center",
        {
          "ring-2 ring-blue-500 text-blue-500": checked,
          "ring-1 ring-gray-400": !checked,
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

export function SelectorCheckbox({ className, ...rest }: CheckboxProps) {
  return (
    <span className={cn("absolute top-1 right-1 flex", className)}>
      <Checkbox {...rest} size="small" />
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
      className={cn("flex-none max-w-full text-xs text-center", className)}
    />
  );
}
