import { forwardRef } from "react";
import { cn } from "~/core/classNames";
import { Primitive } from "~/core/primitives";

export const Overlay = forwardRef<
  React.ComponentRef<typeof Primitive.div>,
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
        "top-0 right-0 z-30 h-screen w-full overscroll-none bg-black/20 cursor-pointer",
        className
      )}
    />
  );
});
