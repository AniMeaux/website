import { useLocation } from "@remix-run/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import invariant from "tiny-invariant";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useFocusTrap } from "~/core/focusTrap";
import { useScrollLock } from "~/core/scrollLock";
import { Icon } from "~/generated/icon";
import logo from "~/images/logo.svg";
import { handleEscape, NavGroup, NavLink } from "~/layout/navigation/shared";
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

  const dropdownMountingPoint = useMemo(() => {
    return typeof document !== "undefined"
      ? document.createElement("div")
      : null;
  }, []);

  useEffect(() => {
    if (dropdownMountingPoint != null) {
      document.body.appendChild(dropdownMountingPoint);
      return () => {
        document.body.removeChild(dropdownMountingPoint);
      };
    }
  }, [dropdownMountingPoint]);

  // If the page has scrolled just a bit, the header is no longer entirely
  // visible.
  // So we scroll to top to make sure the header is entirely visible.
  // Do it before locking scroll so we don't restore the scroll position.
  useEffect(() => {
    if (state.isOpened) {
      window.scrollTo({ top: 0 });
    }
  }, [state.isOpened]);

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  useScrollLock(navRef, { disabled: !state.isOpened });
  useFocusTrap(headerRef, { disabled: !state.isOpened });

  return (
    <header
      ref={headerRef}
      className={cn(
        "relative z-[0] w-full px-page py-2 flex items-center justify-between",
        "md:hidden"
      )}
      onKeyDown={handleEscape(() => {
        setState((prevState) =>
          state.isOpened ? { isOpened: false } : prevState
        );
      })}
    >
      <BaseLink to="/" className="flex">
        <img src={logo} alt="Ani'Meaux" className="h-[40px]" />
      </BaseLink>

      <button
        className="flex p-2"
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
          invariant(
            dropdownMountingPoint != null,
            "dropdownMountingPoint should exists."
          );

          return (
            <div
              className={cn(
                "absolute -z-10 top-0 left-0 w-full h-screen bg-white pt-[64px] px-2 pb-2 flex",
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
                  Découvrir
                </NavGroupButton>

                <SubNav isOpened={state.openedGroup === "discover"}>
                  <SubNavDiscover />
                </SubNav>

                <NavLink to="/evenements">Événements</NavLink>
              </nav>
            </div>
          );
        }}
      </Transition>

      <Transition mountOnEnter unmountOnExit in={state.isOpened} timeout={100}>
        {(transitionState) => (
          <SocialLinks
            className={cn("absolute top-1/2 -translate-y-1/2 left-1/2", {
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
      className={cn(
        className,
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
        className={cn("group-hover:text-black", {
          "text-gray-500": !isActive,
        })}
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
              className="bg-gray-50 rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg px-2 py-3 flex flex-col"
            >
              {children}
            </div>
          </div>
        );
      }}
    </Transition>
  );
}
