import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

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
        "right-0 top-0 z-30 h-full w-full cursor-pointer overscroll-none bg-black/20 animation-opacity-0 animation-duration-150 data-[state=open]:animation-enter data-[state=closed]:animation-exit md:animation-duration-100",
        className,
      )}
    />
  );
});
