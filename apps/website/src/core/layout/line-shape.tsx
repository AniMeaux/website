import { cn } from "@animeaux/core";

export function LineShapeHorizontal({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 204 28"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className, "overflow-visible")}
      style={style}
    >
      <path
        d="M2 12C5.61328 18.7346 10.7301 21.5689 18.1728 18.7346C44.8906 8.55961 95.2231 -4.4883 132.789 5.68599C157.268 12.316 196.676 30.5412 202 24.9487"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function LineShapeVertical({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 204"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className, "overflow-visible")}
    >
      <path
        d="M16 2C9.26544 5.61328 6.43106 10.7301 9.26544 18.1728C19.4404 44.8906 32.4883 95.2231 22.314 132.789C15.684 157.268 -2.54123 196.676 3.05134 202"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
