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
        "top-0 right-0 z-30 h-full w-full overscroll-none bg-black/20 cursor-pointer data-[state=open]:animation-enter data-[state=closed]:animation-exit animation-opacity-0 animation-duration-150 md:animation-duration-100",
        className,
      )}
    />
  );
});
