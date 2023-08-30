import { cn } from "@animeaux/core";

export function LegalBackground({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1024 400"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-visible", className)}
    >
      <path
        d="M0 400V-20C300 -12 724 -10 1024 0V420H0Z"
        className="fill-prussianBlue"
      />
    </svg>
  );
}
