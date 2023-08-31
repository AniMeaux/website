import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

export const Primitive = {
  aside: forwardRef<
    React.ComponentRef<"aside">,
    React.ComponentPropsWithoutRef<"aside"> & { asChild?: boolean }
  >(function PrimitiveAside({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "aside";
    return <Component {...props} ref={ref} />;
  }),

  button: forwardRef<
    React.ComponentRef<"button">,
    React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean }
  >(function PrimitiveButton({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "button";
    return <Component {...props} ref={ref} />;
  }),

  div: forwardRef<
    React.ComponentRef<"div">,
    React.ComponentPropsWithoutRef<"div"> & { asChild?: boolean }
  >(function PrimitiveDiv({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "div";
    return <Component {...props} ref={ref} />;
  }),

  form: forwardRef<
    React.ComponentRef<"form">,
    React.ComponentPropsWithoutRef<"form"> & { asChild?: boolean }
  >(function PrimitiveForm({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "form";
    return <Component {...props} ref={ref} />;
  }),

  h2: forwardRef<
    React.ComponentRef<"h2">,
    React.ComponentPropsWithoutRef<"h2"> & { asChild?: boolean }
  >(function PrimitiveH2({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "h2";
    return <Component {...props} ref={ref} />;
  }),

  input: forwardRef<
    React.ComponentRef<"input">,
    React.ComponentPropsWithoutRef<"input"> & { asChild?: boolean }
  >(function PrimitiveInput({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "input";
    return <Component {...props} ref={ref} />;
  }),

  label: forwardRef<
    React.ComponentRef<"label">,
    React.ComponentPropsWithoutRef<"label"> & { asChild?: boolean }
  >(function PrimitiveLabel({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "label";
    return <Component {...props} ref={ref} />;
  }),

  li: forwardRef<
    React.ComponentRef<"li">,
    React.ComponentPropsWithoutRef<"li"> & { asChild?: boolean }
  >(function PrimitiveLi({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "li";
    return <Component {...props} ref={ref} />;
  }),

  p: forwardRef<
    React.ComponentRef<"p">,
    React.ComponentPropsWithoutRef<"p"> & { asChild?: boolean }
  >(function PrimitiveP({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "p";
    return <Component {...props} ref={ref} />;
  }),

  section: forwardRef<
    React.ComponentRef<"section">,
    React.ComponentPropsWithoutRef<"section"> & { asChild?: boolean }
  >(function PrimitiveSection({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "section";
    return <Component {...props} ref={ref} />;
  }),

  span: forwardRef<
    React.ComponentRef<"span">,
    React.ComponentPropsWithoutRef<"span"> & { asChild?: boolean }
  >(function PrimitiveSpan({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "span";
    return <Component {...props} ref={ref} />;
  }),

  ul: forwardRef<
    React.ComponentRef<"ul">,
    React.ComponentPropsWithoutRef<"ul"> & { asChild?: boolean }
  >(function PrimitiveUl({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "ul";
    return <Component {...props} ref={ref} />;
  }),
};
