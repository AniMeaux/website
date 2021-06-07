import cn from "classnames";
import { Button, ButtonProps } from "ui/actions/button";
import { useIsScrollAtTheBottom } from "ui/layouts/usePageScroll";

export function SubmitButton({
  type = "submit",
  variant = "primary",
  className,
  ...rest
}: ButtonProps) {
  const { isAtTheBottom } = useIsScrollAtTheBottom();

  return (
    <Button
      {...rest}
      type={type}
      variant={variant}
      className={cn(
        "SubmitButton",
        { "SubmitButton--hasScroll": !isAtTheBottom },
        className
      )}
    />
  );
}
