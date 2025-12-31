import { BaseLink } from "#i/core/base-link";
import { useFocusTrap } from "#i/core/focus-trap";
import type { NavGroup } from "#i/core/layout/navigation/shared";
import {
  handleEscape,
  navLinkClassName,
} from "#i/core/layout/navigation/shared";
import { ShowBanner } from "#i/core/layout/navigation/show-banner";
import { SocialLinks } from "#i/core/layout/navigation/social-links";
import { SubNavAct } from "#i/core/layout/navigation/sub-nav-act";
import { SubNavAdopt } from "#i/core/layout/navigation/sub-nav-adopt";
import { SubNavDiscover } from "#i/core/layout/navigation/sub-nav-discover";
import { SubNavWarn } from "#i/core/layout/navigation/sub-nav-warn";
import { useScrollLock } from "#i/core/scroll-lock";
import { Icon } from "#i/generated/icon";
import logo from "#i/images/logo.svg";
import nameAndLogo from "#i/images/name-and-logo.svg";
import { cn } from "@animeaux/core";
import { useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import invariant from "tiny-invariant";

type State =
  | { isOpened: false; openedGroup?: null }
  | { isOpened: true; openedGroup?: NavGroup | null };

export function SmallNav({
  displayShowBanner,
}: {
  displayShowBanner: boolean;
}) {
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
      className="relative z-10 flex w-full flex-col md:hidden"
      onKeyDown={handleEscape(() => {
        setState((prevState) =>
          state.isOpened ? { isOpened: false } : prevState,
        );
      })}
      style={{ "--header-height": displayShowBanner ? "112px" : "56px" }}
    >
      {displayShowBanner ? <ShowBanner className="z-10" /> : null}

      <div
        className={cn(
          "flex items-center justify-between px-page pb-2",
          displayShowBanner ? "pt-2" : "pt-safe-2",
        )}
      >
        <BaseLink to="/" className="z-10 flex overflow-hidden">
          <img
            src={state.isOpened ? logo : nameAndLogo}
            alt="Ani’Meaux"
            className="h-[40px]"
          />
        </BaseLink>

        <button
          className="z-10 flex p-2"
          onClick={() =>
            setState((prevState) =>
              prevState.isOpened ? { isOpened: false } : { isOpened: true },
            )
          }
        >
          <Icon
            id={state.isOpened ? "x-mark" : "bars"}
            className="text-[20px]"
          />
        </button>

        <Transition
          mountOnEnter
          unmountOnExit
          in={state.isOpened}
          timeout={100}
        >
          {(transitionState) => {
            return (
              <div
                className={cn(
                  "absolute left-0 top-0 h-screen w-full bg-white",
                  // We need to handle safe areas because this element has
                  // absolute positioning.
                  "pb-safe-2 pt-safe-[calc(8px+var(--header-height))] px-safe-page",
                  "flex",
                  {
                    "translate-y-0 opacity-100 transition-[opacity,transform] duration-100 ease-out":
                      transitionState === "entering",
                    "translate-y-0 opacity-100": transitionState === "entered",
                    "-translate-y-4 opacity-0 transition-[opacity,transform] duration-100 ease-in":
                      transitionState === "exiting",
                    "-translate-y-4 opacity-0": transitionState === "exited",
                  },
                )}
              >
                <nav
                  ref={navRef}
                  className="flex h-full min-h-0 w-full flex-col overflow-auto"
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

        <Transition
          mountOnEnter
          unmountOnExit
          in={state.isOpened}
          timeout={100}
        >
          {(transitionState) => (
            <SocialLinks
              className={cn("absolute bottom-3 left-1/2 z-10", {
                "-translate-x-1/2 opacity-100 transition-[opacity,transform] duration-100 ease-out":
                  transitionState === "entering",
                "-translate-x-1/2 opacity-100": transitionState === "entered",
                "translate-x-0 opacity-0 transition-[opacity,transform] duration-100 ease-in":
                  transitionState === "exiting",
                "translate-x-0 opacity-0": transitionState === "exited",
              })}
            />
          )}
        </Transition>
      </div>
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
        id={isActive ? "caret-up" : "caret-down"}
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
            className={cn("flex flex-none flex-col overflow-hidden", {
              // Use `ease-in-out` to make sure animation is symetrical between
              // entering and exiting to avoid a weird progress missmatch.
              "transition-[height] duration-100 ease-in-out":
                transitionState === "entering" || transitionState === "exiting",
            })}
            style={{ height: containerHeight }}
          >
            <div
              ref={childrenRef}
              className="flex flex-col bg-gray-50 px-2 py-3 rounded-bubble-md"
            >
              {children}
            </div>
          </div>
        );
      }}
    </Transition>
  );
}
