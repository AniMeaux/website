import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const ProseInlineAction = forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  React.ComponentPropsWithoutRef<typeof Primitive.button>
>(function ProseInlineAction({ className, ...props }, ref) {
  return (
    <Primitive.button
      {...props}
      ref={ref}
      className={cn(
        "relative border-b border-mystic text-body-lowercase-emphasis can-hover:hover:border-b-2 can-hover:focus-visible:focus-spaced",
        className,
      )}
    />
  );
});
