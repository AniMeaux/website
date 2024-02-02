import { cn } from "@animeaux/core";

export function FooterWave({ className }: { className?: string }) {
  return (
    <>
      <svg
        viewBox="0 0 1440 90"
        fill="none"
        // Allow the shape to stretch.
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("hidden md:block", className)}
      >
        <path
          d="m0 27.1955c103-17.44588 244.5-33.89436 371.5-24.42371 141.665 10.56421 329 38.87881 455 38.87881 145.5 0 249-.0036 349-.0036 122.92 0 183-7.4732 264.5-7.4732v55.8262h-1440z"
          className="fill-paleBlue"
        />
      </svg>

      <svg
        viewBox="0 0 320 53"
        fill="none"
        // Allow the shape to stretch.
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("md:hidden", className)}
      >
        <path
          d="m0 9.02789c13-3.00984 27.5221-4.51477 45.5-4.51477h232.5c16.476 0 28.5-1.50492 42-4.01312v53h-320z"
          className="fill-paleBlue"
        />
      </svg>
    </>
  );
}
