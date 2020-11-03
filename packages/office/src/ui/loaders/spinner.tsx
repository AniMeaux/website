import cn from "classnames";
import * as React from "react";

export function Spinner({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn("relative animation-loader-spin", className)}
      style={{ width: "1em", height: "1em" }}
    >
      <svg
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 origin-center animation-loader-svg"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="1, 300"
        strokeDashoffset="0"
      >
        <circle strokeWidth="8" cx="33" cy="33" r="28" />
      </svg>
    </div>
  );
}
