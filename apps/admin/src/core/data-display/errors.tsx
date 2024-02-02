import type { InlineHelperProps } from "#core/data-display/helper";
import { InlineHelper } from "#core/data-display/helper";
import { joinReactNodes } from "#core/join-react-nodes";

export function ErrorsInlineHelper({
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
