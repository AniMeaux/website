import { BeeIllustration } from "#core/Illustration/bee";
import { useElementSize } from "#core/elements";
import { useScreenSizeCondition } from "#core/screenSize";
import { theme } from "#generated/theme";
import { cn } from "@animeaux/core";

export function BoardCard({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "relative p-3 bg-var-alabaster md:px-10 md:py-6",
        className,
      )}
    >
      <BoardBackground />

      <BeeIllustration
        direction="left-to-right"
        className="absolute bottom-0 right-2 -z-10 w-[25px] translate-y-1/2 md:right-4"
      />

      {children}
    </div>
  );
}

function BoardBackground() {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const isMedium = useScreenSizeCondition(
    (screenSize) => screenSize >= theme.screensPx.md,
  );

  return (
    // ResizeObserver don't seem to work on SVG in Safari.
    // https://stackoverflow.com/questions/65565149/how-to-apply-resizeobserver-to-svg-element
    <div ref={ref} className="absolute left-0 top-0 -z-10 grid h-full w-full">
      <svg
        viewBox={size == null ? "0 0 0 0" : `0 0 ${size.width} ${size.height}`}
        fill="none"
        // Allow the shape to stretch.
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full overflow-visible"
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
  );
}

function Background({
  width,
  height,
  isMedium,
}: {
  width: number;
  height: number;
  isMedium: boolean;
}) {
  const spacing = isMedium ? theme.spacing[2] : theme.spacing[1];
  const radius = isMedium ? theme.spacing[4] : theme.spacing[2];

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
  );
}

function Dots({
  width,
  height,
  isMedium,
}: {
  width: number;
  height: number;
  isMedium: boolean;
}) {
  const spacing = isMedium ? theme.spacing[2] : theme.spacing[1];
  const radius = isMedium ? theme.spacing[4] : theme.spacing[2];

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
  );
}
