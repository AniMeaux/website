import { BeeIllustration } from "~/core/Illustration/bee";
import { cn } from "~/core/classNames";
import { useElementSize } from "~/core/hooks";
import { useScreenSizeCondition } from "~/core/screenSize";
import { theme } from "~/generated/theme";

export function BoardCard({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("relative p-3 md:px-10 md:py-6", className)}>
      <BoardBackground />

      <BeeIllustration
        direction="left-to-right"
        className="absolute -z-10 bottom-0 right-1 md:right-3 translate-y-[6.75px] w-[25px]"
      />

      {children}
    </div>
  );
}

function BoardBackground() {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const isMedium = useScreenSizeCondition(
    (screenSize) => screenSize >= theme.screensPx.md
  );

  return (
    // ResizeObserver don't seem to work on SVG in Safari.
    // https://stackoverflow.com/questions/65565149/how-to-apply-resizeobserver-to-svg-element
    <div ref={ref} className="absolute -z-10 top-0 left-0 w-full h-full grid">
      <svg
        viewBox={size == null ? "0 0 0 0" : `0 0 ${size.width} ${size.height}`}
        fill="none"
        // Allow the shape to stretch.
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible w-full h-full"
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
