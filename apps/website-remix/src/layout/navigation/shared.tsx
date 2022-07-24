import invariant from "invariant";
import { forwardRef, useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";
import { LineShapeHorizontal } from "~/layout/lineShape";

export type NavGroup = "act" | "adopt" | "discover" | "warn";

export const NavGroupButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive: boolean;
  }
>(function NavGroupButton({ children, isActive, ...rest }, ref) {
  // Use a large number instead of 0 to make sure the line is not visible by
  // default.
  const [width, setWidth] = useState(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    // We reuse the forward ref to avoid having to "merge" it with a local one.
    invariant(typeof ref === "object" && ref != null, "ref must be an object");
    invariant(ref.current != null, "ref must be set");
    setWidth(ref.current?.clientWidth);
  }, [ref]);

  return (
    <button
      ref={ref}
      {...rest}
      className={cn(
        "group relative px-3 py-2 flex items-center justify-between gap-1 hover:text-black",
        {
          "text-black": isActive,
          "text-gray-700": !isActive,
        }
      )}
    >
      <span>{children}</span>

      <Icon
        id={isActive ? "caretUp" : "caretDown"}
        className={cn("group-hover:text-black", "md:hidden", {
          "text-gray-500": !isActive,
        })}
      />

      <Transition mountOnEnter unmountOnExit in={isActive} timeout={150}>
        {(transitionState) => (
          <LineShapeHorizontal
            className={cn(
              "hidden",
              "md:absolute md:bottom-0 md:left-0 md:w-full md:h-1 md:block md:stroke-blue-base",
              {
                "md:transition-[stroke-dashoffset] md:duration-150 md:ease-in-out":
                  transitionState === "entering" ||
                  transitionState === "exiting",
              }
            )}
            style={{
              strokeDasharray: width,
              strokeDashoffset:
                transitionState === "entering" || transitionState === "entered"
                  ? 0
                  : width,
            }}
          />
        )}
      </Transition>
    </button>
  );
});

export const NavLink = forwardRef<HTMLAnchorElement, BaseLinkProps>(
  function NavLink({ className, ...rest }, ref) {
    return (
      <BaseLink
        {...rest}
        ref={ref}
        className={cn(
          className,
          "px-3 py-2 flex items-center justify-between gap-1 text-gray-700 hover:text-black"
        )}
      />
    );
  }
);

type SubNavItemColor = "blue" | "cyan" | "green" | "red" | "yellow";

const subNavItemBgColorClassName: Record<SubNavItemColor, string> = {
  blue: "bg-blue-base",
  cyan: "bg-cyan-base",
  green: "bg-green-base",
  red: "bg-red-base",
  yellow: "bg-yellow-base",
};

const subNavItemTextColorClassName: Record<SubNavItemColor, string> = {
  blue: "text-blue-base",
  cyan: "text-cyan-base",
  green: "text-green-base",
  red: "text-red-base",
  yellow: "text-yellow-darker",
};

export const SubNavItem = forwardRef<
  HTMLAnchorElement,
  BaseLinkProps & {
    icon: IconProps["id"];
    children: string;
    isMultiline?: boolean;
    color: SubNavItemColor;
  }
>(function SubNavItem(
  { icon, children, color, isMultiline = false, className, ...rest },
  ref
) {
  return (
    <BaseLink
      ref={ref}
      {...rest}
      className={cn(
        className,
        "group bg-opacity-0 px-3 py-2 flex items-center hover:bg-opacity-10 rounded-tl-2xl rounded-tr-xl rounded-br-2xl rounded-bl-xl transition-colors duration-100 ease-in-out",
        subNavItemBgColorClassName[color],
        {
          "flex-col gap-1": isMultiline,
          "gap-3": !isMultiline,
        }
      )}
    >
      <span
        className={cn(
          "rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg bg-opacity-5 flex group-hover:bg-opacity-0 transition-colors duration-100 ease-in-out",
          {
            "p-3 text-[32px]": isMultiline,
            "p-2 text-[20px]": !isMultiline,
          },
          subNavItemBgColorClassName[color],
          subNavItemTextColorClassName[color]
        )}
      >
        <Icon id={icon} />
      </span>

      <span className="flex-1 min-w-0">{children}</span>

      {!isMultiline && (
        <Icon
          id="arrowRight"
          className={cn(
            "opacity-0 text-[20px] group-hover:opacity-100 transition-opacity duration-100 ease-in-out",
            subNavItemTextColorClassName[color]
          )}
        />
      )}
    </BaseLink>
  );
});

// Global var (`window.__DEBUG_NAV__`) to debug navigation.
declare global {
  var __DEBUG_NAV__: any;
}

export function handleBlur(callback: () => void) {
  return (event: React.FocusEvent<HTMLDivElement, Element>) => {
    // Don't handle blur events when we want to debug.
    if (typeof window !== "undefined" && Boolean(window.__DEBUG_NAV__)) {
      return;
    }

    if (
      event.relatedTarget == null ||
      !event.currentTarget.contains(event.relatedTarget as Node)
    ) {
      // Let pending events run before invoking the callback (mouseup, click).
      setTimeout(callback);
    }
  };
}

export function handleEscape(callback: () => void) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && !event.isDefaultPrevented()) {
      event.preventDefault();
      callback();
    }
  };
}
