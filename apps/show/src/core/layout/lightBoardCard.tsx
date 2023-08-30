import { BeeIllustration } from "#core/Illustration/bee.tsx";
import { useElementSize } from "#core/elements.ts";
import { useScreenSizeCondition } from "#core/screenSize.ts";
import { theme } from "#generated/theme.ts";
import { cn } from "@animeaux/core";

export function LightBoardCard({
  isSmall = false,
  children,
  className,
}: React.PropsWithChildren<{ className?: string }> & {
  isSmall?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative p-3",
        isSmall ? undefined : "md:px-10 md:py-6",
        className,
      )}
    >
      <LightBoardBackground isSmall={isSmall} />

      <BeeIllustration
        direction="left-to-right"
        className={cn(
          "absolute -z-10 bottom-0.5 translate-y-1/2 right-2.5 w-[25px]",
          isSmall ? undefined : "md:bottom-1 md:right-5",
        )}
      />

      {children}
    </div>
  );
}

function LightBoardBackground({ isSmall }: { isSmall: boolean }) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const isMedium = useScreenSizeCondition(
    (screenSize) => screenSize >= theme.screensPx.md,
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
          <Dots
            width={size.width}
            height={size.height}
            isMedium={isMedium && !isSmall}
          />
        ) : null}
      </svg>
    </div>
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
  const spacing = isMedium ? theme.spacing[1] : theme.spacing["0.5"];
  const radius = isMedium ? theme.spacing[4] : theme.spacing[2];

  return (
    <rect
      x={spacing}
      y={spacing}
      width={width - 2 * spacing}
      height={height - 2 * spacing}
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
