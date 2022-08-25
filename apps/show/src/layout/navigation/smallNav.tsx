import { useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useFocusTrap } from "~/core/focusTrap";
import { useScrollLock } from "~/core/scrollLock";
import { Icon } from "~/generated/icon";
import nameAndLogo from "~/images/nameAndLogo.svg";
import { handleEscape, NavLink } from "~/layout/navigation/shared";
import { SocialLinks } from "~/layout/navigation/socialLinks";

export function SmallNav() {
  const location = useLocation();
  const [isOpened, setIsOpened] = useState(false);

  // Force close on navigation change.
  useEffect(() => {
    setIsOpened(false);
  }, [location.key]);

  // If the page has scrolled just a bit, the header is no longer entirely
  // visible.
  // So we keep the scroll at the top to make sure the header is entirely
  // visible while the nav is opened.
  // Do it before locking scroll so we don't restore the scroll position.
  useEffect(() => {
    if (isOpened) {
      window.scrollTo({ top: 0 });
    }
  });

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  useScrollLock(navRef, { disabled: !isOpened });
  useFocusTrap(headerRef, { disabled: !isOpened });

  return (
    <header
      ref={headerRef}
      className={cn(
        "relative z-10 w-full pt-safe-2 px-page pb-2 flex items-center justify-between",
        "md:hidden"
      )}
      onKeyDown={handleEscape(() => setIsOpened(false))}
    >
      <BaseLink to="/" className="overflow-hidden flex">
        <Transition in={!isOpened} timeout={100}>
          {(transitionState) => {
            return (
              <img
                src={nameAndLogo}
                alt="Salon des Ani'Meaux"
                className={cn("h-[40px]", {
                  // 100px is enough to hide the text.
                  // TODO: Find a better way to do this.
                  "-translate-x-[100px] transition-transform duration-100 ease-out":
                    transitionState === "exiting",
                  "-translate-x-[100px]": transitionState === "exited",
                  "translate-x-0 transition-transform duration-100 ease-in":
                    transitionState === "entering",
                  " translate-x-0": transitionState === "entered",
                })}
              />
            );
          }}
        </Transition>
      </BaseLink>

      <button
        className="flex p-2"
        onClick={() => setIsOpened((isOpened) => !isOpened)}
      >
        <Icon id={isOpened ? "xMark" : "bars"} className="text-[20px]" />
      </button>

      <Transition mountOnEnter unmountOnExit in={isOpened} timeout={100}>
        {(transitionState) => {
          return (
            <div
              className={cn(
                "absolute -z-10 top-0 left-0 w-full h-screen bg-white",
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
                <NavLink to="/exposants">Exposants</NavLink>
                <NavLink to="/programme">Programme</NavLink>
                <NavLink to="/acces">Accès</NavLink>
                <NavLink to="/faq">FAQ</NavLink>
              </nav>
            </div>
          );
        }}
      </Transition>

      <Transition mountOnEnter unmountOnExit in={isOpened} timeout={100}>
        {(transitionState) => (
          <SocialLinks
            className={cn("absolute bottom-3 left-1/2", {
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
