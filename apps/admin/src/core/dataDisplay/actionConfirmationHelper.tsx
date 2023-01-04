import { Helper, HelperProps } from "~/core/dataDisplay/helper";
import {
  ActionConfirmationType,
  useActionConfirmation,
} from "~/core/searchParams";
import { useLayoutEffect } from "~/core/useLayoutEffect";

export function ActionConfirmationHelper({
  type,
  children,
}: {
  type: ActionConfirmationType;
  children?: HelperProps["children"];
}) {
  const { isVisible, clear } = useActionConfirmation(type);

  // For some reason (scroll restoration maybe?) the page might not be at the
  // top when an action confirmation helper is displayed.
  // So we wnat to make sure the user will see it.
  useLayoutEffect(() => {
    if (isVisible) {
      window.scrollTo({ top: 0 });
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <Helper variant="success" action={<button onClick={clear}>Fermer</button>}>
      {children}
    </Helper>
  );
}
