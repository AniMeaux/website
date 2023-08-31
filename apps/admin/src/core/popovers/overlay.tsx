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
        "top-0 right-0 z-30 h-full w-full overscroll-none bg-black/20 cursor-pointer data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:ease-out data-[state=closed]:ease-in data-[state=open]:duration-75 data-[state=closed]:duration-75",
        className,
      )}
    />
  );
});
