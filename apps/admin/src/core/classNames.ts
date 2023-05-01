export function cn(
  ...args: (string | undefined | Record<string, boolean>)[]
): string {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (typeof arg === "string") {
      classes.push(arg);
    } else if (typeof arg !== "undefined") {
      Object.entries(arg).forEach(([className, test]) => {
        if (test) {
          classes.push(className);
        }
      });
    }
  });

  return resolvePositioningConflicts(classes.join(" "));
}

/**
 * Make sure "absolute", "fixed" and "sticky" can override "relative" class.
 * This is the only allowed case because "relative" is the only positioning
 * class that can be used by components (to allow "absolute" and "fixed"
 * children).
 * "absolute", "fixed" and "sticky" should not be set by component.
 */
function resolvePositioningConflicts(className: string) {
  let classList = className.trim().split(/\s+/).reverse();

  let hasPosition = false;
  classList = classList.filter((className) => {
    if (hasPosition) {
      return className !== "relative";
    }

    if (["absolute", "fixed", "sticky"].includes(className)) {
      hasPosition = true;
    }

    return true;
  });

  classList.reverse();

  return classList.join(" ");
}
