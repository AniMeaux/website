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
  >(function PrimitiveButton({ asChild = false, ...props }, ref) {
    const Component = asChild ? Slot : "span";
    return <Component {...props} ref={ref} />;
  }),
};
