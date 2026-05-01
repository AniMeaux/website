import { cn } from "@animeaux/core"
import { forwardRef } from "react"
import type { Except } from "type-fest"

import { Icon } from "#i/generated/icon.js"

export const Checkbox = forwardRef<
  React.ComponentRef<"input">,
  Except<React.ComponentPropsWithoutRef<"input">, "type">
>(function Checkbox({ className, ...props }, ref) {
  return (
    <span className={cn("relative flex", className)}>
      <input
        {...props}
        ref={ref}
        type="checkbox"
        className="relative inline-flex h-[14px] w-[14px] appearance-none rounded-0.5 border border-gray-200 bg-white transition-colors focus-ring-spaced checked:border-blue-500 checked:bg-blue-500 focus-visible:focus-ring enabled:cursor-pointer"
      />

      <Icon
        href="icon-check-solid"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 icon-1 text-white"
      />
    </span>
  )
})
