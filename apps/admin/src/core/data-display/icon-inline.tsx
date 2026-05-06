import { cn } from "@animeaux/core"
import { forwardRef } from "react"

import { Icon } from "#i/generated/icon.js"

export const IconInline = forwardRef<
  React.ComponentRef<typeof Icon>,
  React.ComponentPropsWithoutRef<typeof Icon> & {
    title: string
  }
>(function IconInline({ title, className, ...props }, ref) {
  return (
    <span title={title} className={cn("relative pl-2", className)}>
      <Icon
        ref={ref}
        {...props}
        className="absolute top-1/2 left-0 -translate-y-1/2 icon-2"
      />
    </span>
  )
})
