import { cn } from "@animeaux/core"

export function Spinner({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...rest}
      className={cn(
        "relative inline-flex size-[1em] animate-spinner-spin",
        className,
      )}
    >
      <svg
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="1, 300"
        strokeDashoffset="0"
        className="absolute top-0 left-0 size-full origin-center animate-spinner-stroke"
      >
        <circle strokeWidth="8" cx="33" cy="33" r="28" />
      </svg>
    </span>
  )
}
