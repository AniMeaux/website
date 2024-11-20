import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const HelperCard = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.section>,
    React.ComponentPropsWithoutRef<typeof Primitive.section>
  >(function HelperCardRoot({ className, ...props }, ref) {
    return (
      <Primitive.section
        {...props}
        ref={ref}
        className={cn(
          "grid grid-cols-1 gap-2 rounded-1 bg-paleBlue px-2 py-1",
          className,
        )}
      />
    );
  }),

  Title: forwardRef<
    React.ComponentRef<typeof Primitive.h3>,
    React.ComponentPropsWithoutRef<typeof Primitive.h3>
  >(function HelperCardTitle({ className, ...props }, ref) {
    return (
      <Primitive.h3
        {...props}
        ref={ref}
        className={cn("text-body-lowercase-emphasis", className)}
      />
    );
  }),
};
