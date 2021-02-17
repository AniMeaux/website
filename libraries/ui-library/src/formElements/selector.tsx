import cn from "classnames";
import * as React from "react";
import { RawCheckbox, RawCheckboxProps } from "./checkbox";
import { RawRadio, RawRadioProps } from "./radio";

export function Selectors({
  className,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      {...rest}
      className={cn("select-none flex flex-wrap -mt-2 -ml-2", className)}
    />
  );
}

export function SelectorItem({
  className,
  ...rest
}: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li {...rest} className={cn("pt-2 pl-2 max-w-full", className)} />;
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
        "relative cursor-pointer h-10 px-4 rounded-full flex items-center ",
        {
          "bg-blue-500 bg-opacity-5 text-blue-500 active:bg-opacity-10": checked,
          "bg-black bg-opacity-3 active:bg-opacity-10": !checked,
        },
        className
      )}
    />
  );
}

const INPUT_CLASS_NAME =
  "appearance-none focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 absolute inset-0 rounded-full w-full h-full";

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
  return <span {...rest} className={cn("mr-2 flex-none", className)} />;
}

export function SelectorLabel({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...rest} className={cn("flex-1 max-w-full truncate", className)} />
  );
}
