import { cn } from "@animeaux/core";

export function Spinner({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={cn(
        "relative inline-flex h-[1em] w-[1em] animate-spinner-spin",
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
        className="absolute left-0 top-0 h-full w-full origin-center animate-spinner-stroke"
      >
        <circle strokeWidth="8" cx="33" cy="33" r="28" />
      </svg>
    </span>
  );
}
