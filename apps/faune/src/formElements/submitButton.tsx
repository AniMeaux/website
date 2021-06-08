import { Button, ButtonProps } from "actions/button";
import cn from "classnames";
import { useIsScrollAtTheBottom } from "layouts/usePageScroll";
import { Spinner } from "loaders/spinner";

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
