import { cn } from "@animeaux/core"
import { Primitive } from "@animeaux/react-primitives"
import { forwardRef } from "react"

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
        "top-0 right-0 z-30 size-full cursor-pointer overscroll-none bg-white/50 animation-duration-slow in-height-full out-opacity-0 md:animation-duration-normal data-opened:animate-enter data-closed:animate-exit",
        className,
      )}
    />
  )
})
