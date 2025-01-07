import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const ActionInline = forwardRef<
  React.ComponentRef<typeof Primitive.span>,
  React.ComponentPropsWithoutRef<typeof Primitive.span>
>(function ActionInline({ className, ...props }, ref) {
  return (
    <Primitive.span
      {...props}
      ref={ref}
      className={cn("inline-grid h-2 grid-cols-1 content-center", className)}
    />
  );
});
