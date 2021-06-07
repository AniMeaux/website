import cn from "classnames";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  isOptional?: boolean;
  hasError?: boolean;
};

export function Label({
  isOptional = false,
  hasError = false,
  children,
  className,
  ...rest
}: LabelProps) {
  return (
    <label
      {...rest}
      className={cn("Label", { "Label--hasError": hasError }, className)}
    >
      {children}
      {isOptional && " (Optionnel)"}
    </label>
  );
}
