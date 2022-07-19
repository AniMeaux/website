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

  return classes.join(" ");
}
