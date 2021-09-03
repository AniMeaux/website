import cn from "classnames";
import { Button, ButtonProps } from "core/actions/button";
import { useIsScrollAtTheBottom } from "core/layouts/usePageScroll";
import { Spinner } from "core/loaders/spinner";

type SubmitButtonProps = ButtonProps & {
  loading?: boolean;
};

export function SubmitButton({
  type = "submit",
  variant = "primary",
  loading = false,
  className,
  children,
  ...rest
}: SubmitButtonProps) {
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
    >
      <span>{children}</span>

      {loading && (
        <span className="SubmitButton__spinner">
          <Spinner />
        </span>
      )}
    </Button>
  );
}
