export function VerticalSeparator() {
  return (
    <svg
      viewBox="0 0 3 100"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden h-full w-[3px] overflow-visible text-mystic md:block"
    >
      <path
        d="M1.5 0L1.5 100"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="14 13"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function HorizontalSeparator() {
  return (
    <svg
      viewBox="0 0 100 3"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[3px] w-full overflow-visible text-mystic md:hidden"
    >
      <path
        d="M0 1.5L100 1.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="14 13"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
