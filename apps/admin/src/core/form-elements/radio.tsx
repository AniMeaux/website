import { cn } from "@animeaux/core"
import { forwardRef } from "react"
import type { Except } from "type-fest"

export const Radio = forwardRef<
  React.ComponentRef<"input">,
  Except<React.ComponentPropsWithoutRef<"input">, "type">
>(function Radio({ className, ...props }, ref) {
  return (
    <input
      {...props}
      ref={ref}
      type="radio"
      className={cn(
        "relative inline-flex h-[14px] w-[14px] appearance-none rounded-full bg-blue-500 focus-ring-spaced focus-visible:focus-ring enabled:cursor-pointer",

        // Border.
        "border border-gray-200 checked:border-blue-500",

        // Center dot.
        "before:absolute before:top-1/2 before:left-1/2 before:h-[12px] before:w-[12px] before:-translate-x-1/2 before:-translate-y-1/2 before:scale-100 before:rounded-full before:bg-white before:transition-transform checked:before:scale-[.33]",
        className,
      )}
    />
  )
})
