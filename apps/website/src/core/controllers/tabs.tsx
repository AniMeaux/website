import { cn } from "@animeaux/core"
import { Transition } from "react-transition-group"

import { useWidth } from "#i/core/hooks.js"
import { LineShapeHorizontal } from "#i/core/layout/line-shape.js"

export function Tab({
  onSelect,
  isActive,
  children,
}: {
  onSelect: () => void
  isActive: boolean
  children: React.ReactNode
}) {
  const { ref, width } = useWidth<HTMLButtonElement>()

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex px-3 py-2 text-body-emphasis transition-colors duration-slow",
        {
          "text-brand-blue": isActive,
          "text-gray-600 hover:text-black": !isActive,
        },
      )}
    >
      <span className="flex items-center gap-2">{children}</span>

      <Transition in={isActive} timeout={150}>
        {(transitionState) => (
          <LineShapeHorizontal
            className={cn("absolute bottom-0 left-0 block h-1 w-full", {
              "transition-[stroke-dashoffset] duration-slow":
                transitionState === "entering" || transitionState === "exiting",
            })}
            style={{
              strokeDasharray: width,
              strokeDashoffset:
                transitionState === "entering" || transitionState === "entered"
                  ? 0
                  : width,
            }}
          />
        )}
      </Transition>
    </button>
  )
}
