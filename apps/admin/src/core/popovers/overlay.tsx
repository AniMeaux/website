import { Primitive } from "@radix-ui/react-primitive";
import { forwardRef } from "react";
import { cn } from "~/core/classNames";

export const Overlay = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Primitive.div>
>(function Overlay({ className, ...rest }, ref) {
  return (
    <Primitive.div
      {...rest}
      ref={ref}
      className={cn(
        // Use absolute instead of fixed to avoid performances issues when
        // mobile browser's height change due to scroll.
        "absolute",
        "top-0 right-0 bottom-0 left-0 z-30 overscroll-none bg-black/20 cursor-pointer",
        className
      )}
    />
  );
});
