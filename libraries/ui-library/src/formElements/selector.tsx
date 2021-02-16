import cn from "classnames";
import * as React from "react";
import { RawCheckbox, RawCheckboxProps } from "./checkbox";
import { RawRadio, RawRadioProps } from "./radio";

export function Selectors({
  className,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul {...rest} className={cn("grid-square gap-2", className)} />;
}

export function SelectorItem(props: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li {...props} />;
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
        "cursor-pointer rounded-xl border border-opacity-10 flex flex-col items-center justify-center",
        {
          "border-blue-500 bg-blue-100 text-blue-500": checked,
          "border-black bg-white": !checked,
        },
        className
      )}
    />
  );
}

const INPUT_CLASS_NAME =
  "appearance-none focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 absolute rounded-xl selector-input";

export function SelectorRadio({ className, ...rest }: RawRadioProps) {
  return <RawRadio {...rest} className={cn(INPUT_CLASS_NAME, className)} />;
}

export function SelectorCheckbox({ className, ...rest }: RawCheckboxProps) {
  return <RawCheckbox {...rest} className={cn(INPUT_CLASS_NAME, className)} />;
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
      className={cn(
        "mt-1 flex-none max-w-full overflow-ellipsis overflow-hidden px-2 text-xs text-center",
        className
      )}
    />
  );
}
