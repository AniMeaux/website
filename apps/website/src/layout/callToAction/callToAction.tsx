import cn from "classnames";
import { Link, LinkProps } from "core/link";
import { ChildrenProp, StyleProps } from "core/types";
import { FaArrowRight } from "react-icons/fa";

export type CallToActionColors = "blue";

const CallToActionColorsClassNames: Record<CallToActionColors, string> = {
  blue: "CallToAction--blue",
};

type CallToActionCommonProps = {
  color: CallToActionColors;
};

export type CallToActionLinkProps = LinkProps & CallToActionCommonProps;
export function CallToActionLink({
  color,
  children,
  className,
  ...rest
}: CallToActionLinkProps) {
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

export type CallToActionButtonProps = CallToActionCommonProps &
  ChildrenProp &
  StyleProps & {
    onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
  };

export function CallToActionButton({
  color,
  children,
  className,
  ...rest
}: CallToActionButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "CallToAction",
        CallToActionColorsClassNames[color],
        className
      )}
    >
      <span>{children}</span>
      <FaArrowRight className="CallToAction__Icon" />
    </button>
  );
}
