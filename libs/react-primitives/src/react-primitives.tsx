import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

const ELEMENT_TYPES = [
  "a",
  "aside",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "header",
  "input",
  "label",
  "li",
  "p",
  "section",
  "span",
  "ul",
] as const;

export const Primitive = ELEMENT_TYPES.reduce((primitive, elementType) => {
  const Component = forwardRef<
    React.ComponentRef<typeof elementType>,
    React.ComponentPropsWithoutRef<typeof elementType> & AsChildProp
  >(({ asChild, ...rest }, ref) => {
    const Component: any = asChild ? Slot : elementType;
    return <Component {...rest} ref={ref} />;
  });

  Component.displayName = `Primitive.${elementType}`;

  return { ...primitive, [elementType]: Component };
}, {} as Primitive);

type AsChildProp = { asChild?: boolean };

type Primitive = {
  [TElementType in (typeof ELEMENT_TYPES)[number]]: React.ForwardRefExoticComponent<
    React.ComponentPropsWithRef<TElementType> & AsChildProp
  >;
};
