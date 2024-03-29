import type { BaseLinkProps } from "#core/base-link";
import { BaseLink } from "#core/base-link";
import { getFocusTrapIgnoreAttribute, useFocusTrap } from "#core/focus-trap";
import { useWidth } from "#core/hooks";
import { LineShapeHorizontal } from "#core/layout/line-shape";
import type { NavGroup } from "#core/layout/navigation/shared";
import { handleEscape, navLinkClassName } from "#core/layout/navigation/shared";
import { ShowBanner } from "#core/layout/navigation/show-banner";
import { SocialLinks } from "#core/layout/navigation/social-links";
import { SubNavAct } from "#core/layout/navigation/sub-nav-act";
import { SubNavAdopt } from "#core/layout/navigation/sub-nav-adopt";
import { SubNavDiscover } from "#core/layout/navigation/sub-nav-discover";
import { SubNavWarn } from "#core/layout/navigation/sub-nav-warn";
import { useScrollLock } from "#core/scroll-lock";
import nameAndLogo from "#images/name-and-logo.svg";
import { cn } from "@animeaux/core";
import { useLocation } from "@remix-run/react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Transition } from "react-transition-group";

type State = NavGroup | null;

export function LargeNav({
  displayShowBanner,
}: {
  displayShowBanner: boolean;
}) {
  const location = useLocation();
  const [openedGroup, setOpenedGroup] = useState<State>(null);

  // Force close on navigation change.
  useEffect(() => {
    setOpenedGroup(null);
  }, [location.key]);

  // If the page has scrolled just a bit, the header is no longer entirely
  // visible.
  // So we scroll to top to make sure the header is entirely visible.
  // Do it before locking scroll so we don't restore the scroll position.
  useEffect(() => {
    if (openedGroup != null) {
      window.scrollTo({ top: 0 });
    }
  }, [openedGroup]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useScrollLock(dropdownRef, { disabled: openedGroup == null });
  useFocusTrap(dropdownRef, {
    shouldFocusFirstChild: true,
    disabled: openedGroup == null,
  });

  return (
    <header
      {...getFocusTrapIgnoreAttribute()}
      className={cn("z-0 hidden w-full flex-col", "md:flex")}
      style={{ "--header-height": displayShowBanner ? "112px" : "56px" }}
    >
      {displayShowBanner ? <ShowBanner /> : null}

      <div
        className={cn(
          "flex items-center justify-between px-page pb-2",
          displayShowBanner ? "pt-2" : "pt-safe-2",
        )}
      >
        <BaseLink to="/" className="flex">
          <img src={nameAndLogo} alt="Ani’Meaux" className="h-[40px]" />
        </BaseLink>

        <nav className="flex lg:gap-2">
          <NavGroupButton
            isActive={
              openedGroup === "adopt" ||
              (SubNavAdopt.isActive(location) && openedGroup == null)
            }
            onClick={() => setOpenedGroup(toggleGroup("adopt"))}
          >
            Adopter
          </NavGroupButton>

          <NavGroupButton
            isActive={
              openedGroup === "act" ||
              (SubNavAct.isActive(location) && openedGroup == null)
            }
            onClick={() => setOpenedGroup(toggleGroup("act"))}
          >
            Agir
          </NavGroupButton>

          <NavGroupButton
            isActive={
              openedGroup === "warn" ||
              (SubNavWarn.isActive(location) && openedGroup == null)
            }
            onClick={() => setOpenedGroup(toggleGroup("warn"))}
          >
            Avertir
          </NavGroupButton>

          <NavGroupButton
            isActive={
              openedGroup === "discover" ||
              (SubNavDiscover.isActive(location) && openedGroup == null)
            }
            onClick={() => setOpenedGroup(toggleGroup("discover"))}
          >
            S’informer
          </NavGroupButton>

          <NavLink to="/evenements" forceNotActive={openedGroup != null}>
            Événements
          </NavLink>

          <Dropdown
            ref={dropdownRef}
            isOpened={openedGroup != null}
            onClose={() => setOpenedGroup(null)}
          >
            {openedGroup === "adopt" && <SubNavAdopt />}
            {openedGroup === "act" && <SubNavAct />}
            {openedGroup === "warn" && <SubNavWarn />}
            {openedGroup === "discover" && <SubNavDiscover />}
          </Dropdown>
        </nav>

        <div className="flex">
          <SocialLinks />
        </div>
      </div>
    </header>
  );
}

function toggleGroup(group: NavGroup) {
  return (prevState: State): State | null => {
    return prevState === group ? null : group;
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
  const { ref, width } = useWidth<HTMLButtonElement>();

  return (
    <button
      ref={ref}
      {...rest}
      className={cn(className, navLinkClassName({ isActive }), "relative")}
    >
      <span>{children}</span>

      <Transition in={isActive} timeout={150}>
        {(transitionState) => (
          <LineShapeHorizontal
            className={cn(
              "absolute bottom-0 left-0 block h-1 w-full text-brandBlue",
              {
                "transition-[stroke-dashoffset] duration-150 ease-in-out":
                  transitionState === "entering" ||
                  transitionState === "exiting",
              },
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
}

function NavLink({
  to,
  children,
  forceNotActive = false,
}: {
  to: BaseLinkProps["to"];
  children: BaseLinkProps["children"];
  forceNotActive: boolean;
}) {
  const { ref, width } = useWidth<HTMLAnchorElement>();

  return (
    <BaseLink
      to={to}
      ref={ref}
      isNavLink
      className={({ isActive }) =>
        cn(
          navLinkClassName({ isActive: isActive && !forceNotActive }),
          "relative",
        )
      }
    >
      {({ isActive }) => (
        <>
          {children}

          <Transition in={isActive && !forceNotActive} timeout={150}>
            {(transitionState) => (
              <LineShapeHorizontal
                className={cn(
                  "absolute bottom-0 left-0 block h-1 w-full text-brandBlue",
                  {
                    "transition-[stroke-dashoffset] duration-150 ease-in-out":
                      transitionState === "entering" ||
                      transitionState === "exiting",
                  },
                )}
                style={{
                  strokeDasharray: width,
                  strokeDashoffset:
                    transitionState === "entering" ||
                    transitionState === "entered"
                      ? 0
                      : width,
                }}
              />
            )}
          </Transition>
        </>
      )}
    </BaseLink>
  );
}

const Dropdown = forwardRef<
  HTMLDivElement,
  {
    isOpened: boolean;
    onClose: () => void;
    children?: React.ReactNode;
  }
>(function Dropdown({ isOpened, onClose, children }, ref) {
  const childrenRef = useRef<HTMLDivElement>(null);
  const [childrenHeight, setChildrenHeight] = useState(0);
  useEffect(() => {
    if (childrenRef.current != null) {
      setChildrenHeight(childrenRef.current.clientHeight);
    }
  }, [children]);

  return (
    <>
      <Transition mountOnEnter unmountOnExit in={isOpened} timeout={100}>
        {(transitionState) => (
          <div
            ref={ref}
            className={cn(
              "absolute left-0 top-0 -z-10 flex w-full flex-col items-center overflow-hidden bg-white shadow-base rounded-bubble-b-lg",
              {
                // Use `ease-in-out` to make sure animation is symetrical between
                // entering and exiting to avoid a weird progress missmatch.
                "transition-[height] duration-100 ease-in-out":
                  transitionState === "entering" ||
                  transitionState === "exiting" ||
                  // Keep it the transition when visible child changes.
                  transitionState === "entered",
              },
            )}
            style={{ height: childrenHeight }}
          >
            <div
              ref={childrenRef}
              className="flex w-[600px] flex-col pb-12 pt-safe-[calc(48px+var(--header-height))]"
              onKeyDown={handleEscape(onClose)}
            >
              {children}
            </div>
          </div>
        )}
      </Transition>

      {isOpened && (
        <div
          {...getFocusTrapIgnoreAttribute()}
          aria-hidden
          tabIndex={-1}
          onClick={() => onClose()}
          className="absolute left-0 top-0 -z-20 h-full w-full cursor-pointer"
        />
      )}
    </>
  );
});
