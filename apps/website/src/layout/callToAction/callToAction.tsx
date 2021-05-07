import cn from "classnames";
import { FaArrowRight } from "react-icons/fa";
import { Link, LinkProps } from "~/core/link";

export type CallToActionColors = "blue";

const CallToActionColorsClassNames: Record<CallToActionColors, string> = {
  blue: "CallToAction--blue",
};

export type CallToActionProps = LinkProps & {
  color: CallToActionColors;
};

export function CallToAction({
  color,
  children,
  className,
  ...rest
}: CallToActionProps) {
  return (
    <Link
      {...rest}
      className={cn(
        "CallToAction",
        CallToActionColorsClassNames[color],
        className
      )}
    >
      <span>{children}</span>
      <FaArrowRight className="CallToAction__Icon" />
    </Link>
  );
}
