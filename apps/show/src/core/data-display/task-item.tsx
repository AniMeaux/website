import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { Link } from "@remix-run/react";
import { forwardRef } from "react";

export const TaskItem = {
  Root: forwardRef<
    React.ComponentRef<typeof Link>,
    React.ComponentPropsWithoutRef<typeof Link>
  >(function TaskItemRoot({ children, className, ...props }, ref) {
    return (
      <Link
        {...props}
        ref={ref}
        className={cn(
          "grid auto-cols-auto grid-flow-col grid-cols-auto-fr items-center gap-1 rounded-2 border border-mystic-200 px-2 py-1 transition-colors duration-normal can-hover:focus-visible:focus-compact md:gap-2",

          // Background.
          "bg-transparent active:bg-mystic-100 can-hover:hover:bg-mystic-50 active:can-hover:hover:bg-mystic-100",
          className,
        )}
      >
        {children}
      </Link>
    );
  }),

  Icon: forwardRef<
    React.ComponentRef<typeof Primitive.span>,
    React.ComponentPropsWithoutRef<typeof Primitive.span>
  >(function TaskItemIcon({ className, ...props }, ref) {
    return (
      <Primitive.span
        {...props}
        ref={ref}
        className={cn("self-start icon-48 md:self-center", className)}
      />
    );
  }),

  Content: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div>
  >(function TaskItemTitle({ className, ...props }, ref) {
    return (
      <Primitive.div
        {...props}
        ref={ref}
        className={cn("grid grid-cols-1", className)}
      />
    );
  }),

  Title: forwardRef<
    React.ComponentRef<typeof Primitive.p>,
    React.ComponentPropsWithoutRef<typeof Primitive.p>
  >(function TaskItemTitle({ className, ...props }, ref) {
    return (
      <Primitive.p
        {...props}
        ref={ref}
        className={cn("text-body-lowercase-emphasis", className)}
      />
    );
  }),

  Description: Primitive.div,

  ChevronIcon: function TaskItemChevronIcon() {
    return (
      <Icon id="chevron-right-light" className="hidden icon-24 md:block" />
    );
  },
};
