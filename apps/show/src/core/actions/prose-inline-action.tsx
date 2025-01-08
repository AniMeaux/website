import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const ProseInlineAction = forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  React.ComponentPropsWithoutRef<typeof Primitive.button> & {
    variant?: Variant;
  }
>(function ProseInlineAction({ variant = "normal", className, ...props }, ref) {
  return (
    <Primitive.button
      {...props}
      ref={ref}
      className={cn(
        "relative can-hover:focus-visible:focus-spaced",
        CLASS_NAME_BY_VARIANT[variant],
        className,
      )}
    />
  );
});

type Variant = "subtle" | "normal";

const CLASS_NAME_BY_VARIANT: Record<Variant, string> = {
  normal: cn(
    "border-b border-mystic text-body-lowercase-emphasis can-hover:hover:border-b-2",
  ),
  subtle: cn("can-hover:hover:border-b can-hover:hover:border-mystic"),
};
