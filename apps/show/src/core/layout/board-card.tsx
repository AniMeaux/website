import { cn } from "@animeaux/core"
import { forwardRef } from "react"

import { useElementSize } from "#i/core/elements.js"
import { BeeIllustration } from "#i/core/illustration/bee.js"
import { useScreenSizeCondition } from "#i/core/screen-size.js"
import { Breakpoint, Spacing } from "#i/generated/theme.js"

export const BoardCard = forwardRef<
  React.ComponentRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(function BoardCard({ children, className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={cn("relative p-3 md:px-10 md:py-6", className)}
    >
      <BoardBackground />

      <BeeIllustration
        direction="left-to-right"
        className="absolute right-2 bottom-0 -z-just-above w-[25px] translate-y-1/2 md:right-4"
      />

      {children}
    </div>
  )
})

function BoardBackground() {
  const { ref, size } = useElementSize<HTMLDivElement>()
  const isMedium = useScreenSizeCondition(
    (screenSize) => screenSize >= Breakpoint.value.md,
  )

  return (
    // ResizeObserver don't seem to work on SVG in Safari.
    // https://stackoverflow.com/questions/65565149/how-to-apply-resizeobserver-to-svg-element
    <div
      ref={ref}
      className="absolute top-0 left-0 -z-just-above grid size-full"
    >
      <svg
        viewBox={size == null ? "0 0 0 0" : `0 0 ${size.width} ${size.height}`}
        fill="none"
        // Allow the shape to stretch.
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-full overflow-visible"
      >
        {size != null ? (
          <>
            <Background
              width={size.width}
              height={size.height}
              isMedium={isMedium}
            />

            <Dots width={size.width} height={size.height} isMedium={isMedium} />
          </>
        ) : null}
      </svg>
    </div>
  )
}

function Background({
  width,
  height,
  isMedium,
}: {
  width: number
  height: number
  isMedium: boolean
}) {
  const spacing = Spacing.unitPx * (isMedium ? 2 : 1)
  const radius = Spacing.unitPx * (isMedium ? 4 : 2)

  return (
    <rect
      x="0"
      y="0"
      width={width - spacing}
      height={height - spacing}
      rx={radius}
      className="fill-alabaster"
      // We don't want the stroke to scale, keep it at 3px.
      vectorEffect="non-scaling-stroke"
    />
  )
}

function Dots({
  width,
  height,
  isMedium,
}: {
  width: number
  height: number
  isMedium: boolean
}) {
  const spacing = Spacing.unitPx * (isMedium ? 2 : 1)
  const radius = Spacing.unitPx * (isMedium ? 4 : 2)

  return (
    <rect
      x={spacing}
      y={spacing}
      width={width - spacing}
      height={height - spacing}
      rx={radius}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="14 16"
      className="stroke-mystic"
      // We don't want the stroke to scale, keep it at 3px.
      vectorEffect="non-scaling-stroke"
    />
  )
}
