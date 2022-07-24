import { useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import invariant from "tiny-invariant";
import { cn } from "~/core/classNames";
import { Icon } from "~/generated/icon";
import {
  handleBlur,
  handleEscape,
  NavGroup,
  NavGroupButton,
  NavLink,
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

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const adoptButtonRef = useRef<HTMLButtonElement>(null);
  const catLinkRef = useRef<HTMLAnchorElement>(null);
  const actButtonRef = useRef<HTMLButtonElement>(null);
  const fosterFamilyLinkRef = useRef<HTMLAnchorElement>(null);
  const warnButtonRef = useRef<HTMLButtonElement>(null);
  const strayCatLinkRef = useRef<HTMLAnchorElement>(null);
  const discoverButtonRef = useRef<HTMLButtonElement>(null);
  const partnersLinkRef = useRef<HTMLAnchorElement>(null);

  // Focus first group button when the menu is opened.
  useEffect(() => {
    if (state.isOpened) {
      invariant(adoptButtonRef.current != null, "adoptButtonRef must be set");
      adoptButtonRef.current.focus();
    }
  }, [state.isOpened]);

  // Focus first link when a group is opened.
  useEffect(() => {
    if (state.openedGroup != null) {
      let linkFocusTargetRef =
        state.openedGroup === "adopt"
          ? catLinkRef
          : state.openedGroup === "act"
          ? fosterFamilyLinkRef
          : state.openedGroup === "warn"
          ? strayCatLinkRef
          : state.openedGroup === "discover"
          ? partnersLinkRef
          : null;

      invariant(
        linkFocusTargetRef?.current != null,
        "linkFocusTargetRef must be set"
      );

      linkFocusTargetRef.current.focus();
    }
  }, [state.openedGroup]);

  return (
    <>
      <button
        ref={menuButtonRef}
        className="flex p-2 md:hidden"
        onClick={() => setState(open())}
      >
        <Icon id={state.isOpened ? "xMark" : "bars"} className="text-[20px]" />
      </button>

      <Transition mountOnEnter unmountOnExit in={state.isOpened} timeout={100}>
        {(transitionState) => (
          <div
            onBlur={handleBlur(() => setState(close()))}
            onKeyDown={handleEscape(() => {
              invariant(
                menuButtonRef.current != null,
                "menuButtonRef must be set"
              );
              menuButtonRef.current.focus();
            })}
            className={cn(
              "absolute -z-10 top-0 left-0 w-full shadow-base rounded-br-[40px] rounded-bl-3xl bg-white pt-[56px] flex",
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
            <nav className="w-full px-2 pt-2 pb-4 flex flex-col">
              <NavGroupButton
                ref={adoptButtonRef}
                isActive={state.openedGroup === "adopt"}
                onClick={() => setState(openGroup("adopt"))}
              >
                Adopter
              </NavGroupButton>

              <SubNav
                isOpened={state.openedGroup === "adopt"}
                onBlur={handleBlur(() => setState(closeGroup("adopt")))}
                onKeyDown={handleEscape(() => {
                  invariant(
                    adoptButtonRef.current != null,
                    "adoptButtonRef must be set"
                  );

                  adoptButtonRef.current.focus();
                })}
              >
                <SubNavAdopt elementToFocusRef={catLinkRef} />
              </SubNav>

              <NavGroupButton
                ref={actButtonRef}
                isActive={state.openedGroup === "act"}
                onClick={() => setState(openGroup("act"))}
              >
                Agir
              </NavGroupButton>

              <SubNav
                isOpened={state.openedGroup === "act"}
                onBlur={handleBlur(() => setState(closeGroup("act")))}
                onKeyDown={handleEscape(() => {
                  invariant(
                    actButtonRef.current != null,
                    "actButtonRef must be set"
                  );

                  actButtonRef.current.focus();
                })}
              >
                <SubNavAct elementToFocusRef={fosterFamilyLinkRef} />
              </SubNav>

              <NavGroupButton
                ref={warnButtonRef}
                isActive={state.openedGroup === "warn"}
                onClick={() => setState(openGroup("warn"))}
              >
                Avertir
              </NavGroupButton>

              <SubNav
                isOpened={state.openedGroup === "warn"}
                onBlur={handleBlur(() => setState(closeGroup("warn")))}
                onKeyDown={handleEscape(() => {
                  invariant(
                    warnButtonRef.current != null,
                    "warnButtonRef must be set"
                  );

                  warnButtonRef.current.focus();
                })}
              >
                <SubNavWarn elementToFocusRef={strayCatLinkRef} />
              </SubNav>

              <NavGroupButton
                ref={discoverButtonRef}
                isActive={state.openedGroup === "discover"}
                onClick={() => setState(openGroup("discover"))}
              >
                Découvrir
              </NavGroupButton>

              <SubNav
                isOpened={state.openedGroup === "discover"}
                onBlur={handleBlur(() => setState(closeGroup("discover")))}
                onKeyDown={handleEscape(() => {
                  invariant(
                    discoverButtonRef.current != null,
                    "discoverButtonRef must be set"
                  );

                  discoverButtonRef.current.focus();
                })}
              >
                <SubNavDiscover elementToFocusRef={partnersLinkRef} />
              </SubNav>

              <NavLink to="/evenements">Événements</NavLink>
            </nav>
          </div>
        )}
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
    </>
  );
}

function open() {
  return (prevState: State): State => {
    if (prevState.isOpened) {
      return prevState;
    }

    return { isOpened: true };
  };
}

function close() {
  return (prevState: State): State => {
    if (!prevState.isOpened) {
      return prevState;
    }

    return { isOpened: false };
  };
}

function openGroup(group: NavGroup) {
  return (prevState: State): State => {
    if (prevState.isOpened && prevState.openedGroup === group) {
      return prevState;
    }

    return { isOpened: true, openedGroup: group };
  };
}

function closeGroup(group: NavGroup) {
  return (prevState: State): State => {
    if (!prevState.isOpened || prevState.openedGroup !== group) {
      return prevState;
    }

    return { isOpened: true, openedGroup: null };
  };
}

function SubNav({
  isOpened,
  onBlur,
  onKeyDown,
  children,
}: Pick<React.HTMLAttributes<HTMLDivElement>, "onKeyDown" | "onBlur"> & {
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
            className={cn("flex flex-col overflow-hidden", {
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
              onBlur={onBlur}
              onKeyDown={onKeyDown}
            >
              {children}
            </div>
          </div>
        );
      }}
    </Transition>
  );
}
