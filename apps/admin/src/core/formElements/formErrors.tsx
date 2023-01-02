import { Helper, HelperProps } from "~/core/dataDisplay/helper";
import { joinReactNodes } from "~/core/joinReactNodes";

export function FormErrors({
  errors,
  ...rest
}: Omit<HelperProps, "variant" | "children" | "isCompact"> & {
  errors: string[];
}) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <Helper {...rest} isCompact variant="error">
      {joinReactNodes(errors, <br />)}
    </Helper>
  );
}
