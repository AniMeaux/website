import { useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import invariant from "tiny-invariant";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useFocusTrap } from "~/core/focusTrap";
import { useScrollLock } from "~/core/scrollLock";
import { Icon } from "~/generated/icon";
import nameAndLogo from "~/images/nameAndLogo.svg";
import {
  handleEscape,
  NavGroup,
  navLinkClassName,
} from "~/layout/navigation/shared";
import { SocialLinks } from "~/layout/navigation/socialLinks";
import { SubNavAct } from "~/layout/navigation/subNavAct";
import { SubNavAdopt } from "~/layout/navigation/subNavAdopt";
import { SubNavDiscover } from "~/layout/navigation/subNavDiscover";
import { SubNavWarn } from "~/layout/navigation/subNavWarn";

type State =
  | { isOpened: false; openedGroup?: null }
  | { isOpened: true; openedGroup?: NavGroup | null };

export function SmallNav() {
  const location = useLocation();
  const [state, setState] = useState<State>({ isOpened: false });

  // Force close on navigation change.
  useEffect(() => {
    setState({ isOpened: false });
  }, [location.key]);

  // If the page has scrolled just a bit, the header is no longer entirely
  // visible.
  // So we keep the scroll at the top to make sure the header is entirely
  // visible while the nav is opened.
  // Do it before locking scroll so we don't restore the scroll position.
  useEffect(() => {
    if (state.isOpened) {
      window.scrollTo({ top: 0 });
    }
  });

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  useScrollLock(navRef, { disabled: !state.isOpened });
  useFocusTrap(headerRef, { disabled: !state.isOpened });

  return (
    <header
      ref={headerRef}
      className={cn(
        "relative z-10 w-full pt-safe-2 px-page pb-2 flex items-center justify-between",
        "md:hidden"
      )}
      onKeyDown={handleEscape(() => {
        setState((prevState) =>
          state.isOpened ? { isOpened: false } : prevState
        );
      })}
    >
      <BaseLink to="/" className="z-10 overflow-hidden flex">
        <Transition in={!state.isOpened} timeout={100}>
          {(transitionState) => {
            return (
              <img
                src={nameAndLogo}
                alt="Ani’Meaux"
                className={cn("h-[40px]", {
                  // 100px is enough to hide the text.
                  // TODO: Find a better way to do this.
                  "-translate-x-[100px] transition-transform duration-100 ease-in-out":
                    transitionState === "exiting",
                  "-translate-x-[100px]": transitionState === "exited",
                  "translate-x-0 transition-transform duration-100 ease-in-out":
                    transitionState === "entering",
                  "translate-x-0": transitionState === "entered",
                })}
              />
            );
          }}
        </Transition>
      </BaseLink>

      <button
        className="z-10 flex p-2"
        onClick={() =>
          setState((prevState) =>
            prevState.isOpened ? { isOpened: false } : { isOpened: true }
          )
        }
      >
        <Icon id={state.isOpened ? "xMark" : "bars"} className="text-[20px]" />
      </button>

      <Transition mountOnEnter unmountOnExit in={state.isOpened} timeout={100}>
        {(transitionState) => {
          return (
            <div
              className={cn(
                "absolute top-0 left-0 w-full h-screen bg-white",
                // We need to handle safe areas because this element has
                // absolute positioning.
                "pt-safe-[64px] px-safe-page pb-safe-2",
                "flex",
                {
                  "opacity-100 translate-y-0 transition-[opacity,transform] duration-100 ease-out":
                    transitionState === "entering",
                  "opacity-100 translate-y-0": transitionState === "entered",
                  "opacity-0 -translate-y-4 transition-[opacity,transform] duration-100 ease-in":
                    transitionState === "exiting",
                  "opacity-0 -translate-y-4": transitionState === "exited",
                }
              )}
            >
              <nav
                ref={navRef}
                className="w-full h-full min-h-0 overflow-auto flex flex-col"
              >
                <NavGroupButton
                  isActive={state.openedGroup === "adopt"}
                  onClick={() => setState(toggleGroup("adopt"))}
                  className="flex-none"
                >
                  Adopter
                </NavGroupButton>

                <SubNav isOpened={state.openedGroup === "adopt"}>
                  <SubNavAdopt />
                </SubNav>

                <NavGroupButton
                  isActive={state.openedGroup === "act"}
                  onClick={() => setState(toggleGroup("act"))}
                  className="flex-none"
                >
                  Agir
                </NavGroupButton>

                <SubNav isOpened={state.openedGroup === "act"}>
                  <SubNavAct />
                </SubNav>

                <NavGroupButton
                  isActive={state.openedGroup === "warn"}
                  onClick={() => setState(toggleGroup("warn"))}
                  className="flex-none"
                >
                  Avertir
                </NavGroupButton>

                <SubNav isOpened={state.openedGroup === "warn"}>
                  <SubNavWarn />
                </SubNav>

                <NavGroupButton
                  isActive={state.openedGroup === "discover"}
                  onClick={() => setState(toggleGroup("discover"))}
                  className="flex-none"
                >
                  S’informer
                </NavGroupButton>

                <SubNav isOpened={state.openedGroup === "discover"}>
                  <SubNavDiscover />
                </SubNav>

                <BaseLink
                  to="/evenements"
                  isNavLink
                  className={({ isActive }) => navLinkClassName({ isActive })}
                >
                  Événements
                </BaseLink>
              </nav>
            </div>
          );
        }}
      </Transition>

      <Transition mountOnEnter unmountOnExit in={state.isOpened} timeout={100}>
        {(transitionState) => (
          <SocialLinks
            className={cn("absolute z-10 bottom-3 left-1/2", {
              "opacity-100 -translate-x-1/2 transition-[opacity,transform] duration-100 ease-out":
                transitionState === "entering",
              "opacity-100 -translate-x-1/2": transitionState === "entered",
              "opacity-0 translate-x-0 transition-[opacity,transform] duration-100 ease-in":
                transitionState === "exiting",
              "opacity-0 translate-x-0": transitionState === "exited",
            })}
          />
        )}
      </Transition>
    </header>
  );
}

function toggleGroup(group: NavGroup) {
  return (prevState: State): State => {
    return {
      isOpened: true,
      openedGroup: prevState.openedGroup === group ? null : group,
    };
  };
}

function NavGroupButton({
  children,
  isActive,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive: boolean;
}) {
  return (
    <button
      {...rest}
      className={cn(className, navLinkClassName({ isActive }), "group")}
    >
      <span>{children}</span>

      <Icon
        id={isActive ? "caretUp" : "caretDown"}
        className={cn({ "text-gray-500 group-hover:text-black": !isActive })}
      />
    </button>
  );
}

function SubNav({
  isOpened,
  children,
}: {
  isOpened: boolean;
  children?: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  return (
    <Transition mountOnEnter unmountOnExit in={isOpened} timeout={100}>
      {(transitionState) => {
        // Make sure we always see the top of the children, right away.
        if (containerRef.current != null) {
          containerRef.current.scrollTop = 0;
        }

        let containerHeight: number | undefined;
        switch (transitionState) {
          case "exiting":
          case "exited": {
            containerHeight = 0;
            break;
          }

          case "entering":
          case "entered": {
            invariant(childrenRef.current != null, "childrenRef must be set");
            containerHeight = childrenRef.current.clientHeight;
            break;
          }
        }

        return (
          <div
            ref={containerRef}
            className={cn("flex-none flex flex-col overflow-hidden", {
              // Use `ease-in-out` to make sure animation is symetrical between
              // entering and exiting to avoid a weird progress missmatch.
              "transition-[height] duration-100 ease-in-out":
                transitionState === "entering" || transitionState === "exiting",
            })}
            style={{ height: containerHeight }}
          >
            <div
              ref={childrenRef}
              className="bg-gray-50 rounded-bubble-md px-2 py-3 flex flex-col"
            >
              {children}
            </div>
          </div>
        );
      }}
    </Transition>
  );
}
