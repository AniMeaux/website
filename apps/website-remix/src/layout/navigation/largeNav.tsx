import { useLocation } from "@remix-run/react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import invariant from "tiny-invariant";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { getFocusTrapIgnoreAttribute, useFocusTrap } from "~/core/focusTrap";
import { useScrollLock } from "~/core/scrollLock";
import nameAndLogo from "~/images/nameAndLogo.svg";
import { LineShapeHorizontal } from "~/layout/lineShape";
import { handleEscape, NavGroup, NavLink } from "~/layout/navigation/shared";
import { SocialLinks } from "~/layout/navigation/socialLinks";
import { SubNavAct } from "~/layout/navigation/subNavAct";
import { SubNavAdopt } from "~/layout/navigation/subNavAdopt";
import { SubNavDiscover } from "~/layout/navigation/subNavDiscover";
import { SubNavWarn } from "~/layout/navigation/subNavWarn";

type State = NavGroup | null;

export function LargeNav() {
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
      className={cn(
        "z-[0] w-full px-page py-2 hidden items-center justify-between",
        "md:flex"
      )}
    >
      <BaseLink to="/" className="flex">
        <img src={nameAndLogo} alt="Ani'Meaux" className="h-[40px]" />
      </BaseLink>

      <nav className="flex lg:gap-2">
        <NavGroupButton
          isActive={openedGroup === "adopt"}
          onClick={() => setOpenedGroup(toggleGroup("adopt"))}
        >
          Adopter
        </NavGroupButton>

        <NavGroupButton
          isActive={openedGroup === "act"}
          onClick={() => setOpenedGroup(toggleGroup("act"))}
        >
          Agir
        </NavGroupButton>

        <NavGroupButton
          isActive={openedGroup === "warn"}
          onClick={() => setOpenedGroup(toggleGroup("warn"))}
        >
          Avertir
        </NavGroupButton>

        <NavGroupButton
          isActive={openedGroup === "discover"}
          onClick={() => setOpenedGroup(toggleGroup("discover"))}
        >
          Découvrir
        </NavGroupButton>

        <NavLink to="/evenements">Événements</NavLink>

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Use a large number instead of 0 to make sure the line is not visible by
  // default.
  const [width, setWidth] = useState(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    invariant(buttonRef.current != null, "buttonRef must be set");
    setWidth(buttonRef.current?.clientWidth);
  }, []);

  return (
    <button
      ref={buttonRef}
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

      <Transition mountOnEnter unmountOnExit in={isActive} timeout={150}>
        {(transitionState) => (
          <LineShapeHorizontal
            className={cn(
              "absolute bottom-0 left-0 w-full h-1 block stroke-blue-base",
              {
                "transition-[stroke-dashoffset] duration-150 ease-in-out":
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
              "absolute -z-10 top-0 left-0 w-full bg-white shadow-base rounded-br-[40px] rounded-bl-3xl flex flex-col items-center overflow-hidden",
              {
                // Use `ease-in-out` to make sure animation is symetrical between
                // entering and exiting to avoid a weird progress missmatch.
                "transition-[height] duration-100 ease-in-out":
                  transitionState === "entering" ||
                  transitionState === "exiting" ||
                  // Keep it the transition when visible child changes.
                  transitionState === "entered",
              }
            )}
            style={{ height: childrenHeight }}
          >
            <div
              ref={childrenRef}
              className={cn(
                "w-[600px] flex flex-col",
                // 104px = 56px (header height) + 48px (padding)
                "pt-[104px] pb-12"
              )}
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
          className="absolute -z-20 top-0 left-0 w-full h-full cursor-pointer"
        />
      )}
    </>
  );
});
