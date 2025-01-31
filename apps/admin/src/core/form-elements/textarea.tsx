import { BaseTextInput } from "#core/form-elements/base-text-input";
import { useLayoutEffect } from "#core/use-layout-effect";
import autosize from "autosize";
import { forwardRef, useRef } from "react";
import invariant from "tiny-invariant";

export const Textarea = forwardRef<
  React.ComponentRef<"textarea">,
  React.ComponentPropsWithoutRef<"textarea">
>(function Textarea(
  {
    rows = 3,
    disabled,
    className,
    // Should use `"off"` as default value but it is ingored by Chrome.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=587466
    // A random value is used to confuse the browser and make sure previous
    // values are never suggested.
    autoComplete = String(Math.random()),
    ...rest
  },
  propRef,
) {
  invariant(typeof propRef !== "function", "Only object ref are supported.");
  const localRef = useRef<HTMLTextAreaElement>(null);
  const ref = propRef ?? localRef;

  useLayoutEffect(() => {
    const elt = ref.current;
    invariant(elt != null, "ref must be set");
    autosize(elt);

    return () => {
      autosize.destroy(elt);
    };
  }, [ref]);

  useLayoutEffect(() => {
    invariant(ref.current != null, "ref must be set");
    autosize.update(ref.current);
  });

  return (
    <BaseTextInput.Root aria-disabled={disabled} className={className}>
      <BaseTextInput
        variant="outlined"
        leftAdornmentCount={0}
        rightAdornmentCount={0}
        asChild
      >
        <textarea
          {...rest}
          ref={ref}
          rows={rows}
          autoComplete={autoComplete}
          disabled={disabled}
        />
      </BaseTextInput>
    </BaseTextInput.Root>
  );
});
