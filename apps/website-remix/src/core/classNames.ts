export function cn(...args: (string | Record<string, boolean>)[]): string {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (typeof arg === "string") {
      classes.push(arg);
    } else {
      Object.entries(arg).forEach(([className, test]) => {
        if (test) {
          classes.push(className);
        }
      });
    }
  });

  return classes.join(" ");
}
