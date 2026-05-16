import { cn } from "@animeaux/core"
import type { Decorator } from "@storybook/react"

export const DecoratorFrame: Decorator = (storyFn) => {
  return (
    <div
      className={cn(
        "grid h-300 w-400 items-center justify-items-center border border-gray-300",
        // Create stacking context for absolute children.
        // See https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Positioned_layout/Stacking_context#features_creating_stacking_contexts
        "relative z-0",
      )}
    >
      {storyFn()}
    </div>
  )
}
