import cn from "classnames";
import { RawCheckbox, RawCheckboxProps } from "core/formElements/checkbox";
import { RawRadio, RawRadioProps } from "core/formElements/radio";
import { ChildrenProp, StyleProps } from "core/types";
import { Children, isValidElement } from "react";

export type SelectorsProps = ChildrenProp &
  StyleProps & {
    isStretched?: boolean;
  };

export function Selectors({
  isStretched = false,
  className,
  ...rest
}: SelectorsProps) {
  return (
    <ul
      {...rest}
      className={cn(
        "Selectors",
        { "Selectors--isStretched": isStretched },
        className
      )}
    />
  );
}

export type SelectorItemProps = ChildrenProp & StyleProps;
export function SelectorItem({ className, ...rest }: SelectorItemProps) {
  return <li {...rest} className={cn("SelectorItem", className)} />;
}

export type SelectorProps = ChildrenProp & StyleProps;
export function Selector({ className, children, ...rest }: SelectorProps) {
  const checked = Children.toArray(children).some(
    (child) => isValidElement(child) && child.props.checked
  );

  return (
    <label
      {...rest}
      children={children}
      className={cn("Selector", { "Selector--isChecked": checked }, className)}
    />
  );
}

export type SelectorRadioProps = RawRadioProps;
export function SelectorRadio({ className, ...rest }: SelectorRadioProps) {
  return <RawRadio {...rest} className={cn("SelectorInput", className)} />;
}

export type SelectorCheckboxProps = RawCheckboxProps;
export function SelectorCheckbox({
  className,
  ...rest
}: SelectorCheckboxProps) {
  return <RawCheckbox {...rest} className={cn("SelectorInput", className)} />;
}

export type SelectorIconProps = ChildrenProp & StyleProps;
export function SelectorIcon({ className, ...rest }: SelectorIconProps) {
  return <span {...rest} className={cn("SelectorIcon", className)} />;
}

export type SelectorLabelProps = ChildrenProp & StyleProps;
export function SelectorLabel({ className, ...rest }: SelectorLabelProps) {
  return <span {...rest} className={cn("SelectorLabel", className)} />;
}
