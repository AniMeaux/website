import { cn } from "~/core/classNames";

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
