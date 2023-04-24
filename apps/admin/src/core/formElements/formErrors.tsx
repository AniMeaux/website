import { InlineHelper, InlineHelperProps } from "~/core/dataDisplay/helper";
import { joinReactNodes } from "~/core/joinReactNodes";

export function FormErrors({
  errors,
  ...rest
}: Omit<InlineHelperProps, "variant" | "children"> & {
  errors?: string[];
}) {
  if (errors == null || errors.length === 0) {
    return null;
  }

  return (
    <InlineHelper {...rest} variant="error">
      {joinReactNodes(errors, <br />)}
    </InlineHelper>
  );
}
