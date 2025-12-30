import { Icon } from "#i/generated/icon";
import { cn } from "@animeaux/core";
import { forwardRef } from "react";

export const IconInline = forwardRef<
  React.ComponentRef<typeof Icon>,
  React.ComponentPropsWithoutRef<typeof Icon> & {
    title: string;
  }
>(function IconInline({ title, className, ...props }, ref) {
  return (
    <span title={title} className={cn("relative pl-2", className)}>
      <Icon
        ref={ref}
        {...props}
        className="absolute left-0 top-1/2 -translate-y-1/2 text-mystic icon-24"
      />
    </span>
  );
});
