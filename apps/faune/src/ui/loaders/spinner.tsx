import cn from "classnames";
import { StyleProps } from "core/types";

type SpinnerProps = StyleProps;

export function Spinner({ className, ...rest }: SpinnerProps) {
  return (
    <div {...rest} className={cn("Spinner", className)}>
      <svg
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
        className="Spinner__svg"
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
