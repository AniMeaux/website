import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

export const Primitive = {
  button: forwardRef<
    React.ComponentRef<"button">,
    React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean }
  >(function PrimitiveButton({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "button";
    return <Component {...props} ref={ref} />;
  }),

  span: forwardRef<
    React.ComponentRef<"span">,
    React.ComponentPropsWithoutRef<"span"> & { asChild?: boolean }
  >(function PrimitiveSpan({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "span";
    return <Component {...props} ref={ref} />;
  }),

  section: forwardRef<
    React.ComponentRef<"section">,
    React.ComponentPropsWithoutRef<"section"> & { asChild?: boolean }
  >(function PrimitiveSection({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "section";
    return <Component {...props} ref={ref} />;
  }),

  aside: forwardRef<
    React.ComponentRef<"aside">,
    React.ComponentPropsWithoutRef<"aside"> & { asChild?: boolean }
  >(function PrimitiveAside({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "aside";
    return <Component {...props} ref={ref} />;
  }),

  h2: forwardRef<
    React.ComponentRef<"h2">,
    React.ComponentPropsWithoutRef<"h2"> & { asChild?: boolean }
  >(function PrimitiveH2({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "h2";
    return <Component {...props} ref={ref} />;
  }),
};
