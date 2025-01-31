import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const StatusHelper = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.section>,
    React.ComponentPropsWithoutRef<typeof Primitive.section>
  >(function StatusHelperRoot({ className, ...props }, ref) {
    return (
      <Primitive.section
        {...props}
        ref={ref}
        className={cn(
          "grid grid-cols-1 gap-2 rounded-0.5 bg-gray-100 p-1",
          className,
        )}
      />
    );
  }),

  Header: forwardRef<
    React.ComponentRef<typeof Primitive.header>,
    React.ComponentPropsWithoutRef<typeof Primitive.header>
  >(function StatusHelperHeader({ className, ...props }, ref) {
    return (
      <Primitive.header
        {...props}
        ref={ref}
        className={cn("grid grid-cols-auto-fr items-center gap-1", className)}
      />
    );
  }),

  Icon: forwardRef<
    React.ComponentRef<typeof Primitive.span>,
    React.ComponentPropsWithoutRef<typeof Primitive.span>
  >(function StatusHelperIcon({ className, ...props }, ref) {
    return (
      <Primitive.span
        {...props}
        ref={ref}
        className={cn("icon-20", className)}
      />
    );
  }),

  Title: forwardRef<
    React.ComponentRef<typeof Primitive.h3>,
    React.ComponentPropsWithoutRef<typeof Primitive.h3>
  >(function StatusHelperTitle({ className, ...props }, ref) {
    return (
      <Primitive.h3
        {...props}
        ref={ref}
        className={cn("text-body-emphasis", className)}
      />
    );
  }),

  Content: Primitive.div,
};
