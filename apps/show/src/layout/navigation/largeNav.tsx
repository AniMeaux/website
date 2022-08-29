import { useEffect, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import invariant from "tiny-invariant";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import nameAndLogo from "~/images/nameAndLogo.svg";
import { LineShapeHorizontal } from "~/layout/lineShape";
import { navLinkClassName } from "~/layout/navigation/shared";
import { SocialLinks } from "~/layout/navigation/socialLinks";

export function LargeNav() {
  return (
    <header
      className={cn(
        "z-[0] w-full pt-safe-2 px-page pb-2 hidden items-center justify-between",
        "md:flex"
      )}
    >
      <BaseLink to="/" className="flex">
        <img src={nameAndLogo} alt="Salon des Ani'Meaux" className="h-[40px]" />
      </BaseLink>

      <nav className={cn("flex", "lg:gap-2")}>
        <NavLink to="/exposants">Exposants</NavLink>
        <NavLink to="/programme">Programme</NavLink>
        <NavLink to="/acces">Accès</NavLink>
        <NavLink to="/faq">FAQ</NavLink>
      </nav>

      <div className="flex">
        <SocialLinks />
      </div>
    </header>
  );
}

function NavLink({ children, ...rest }: Omit<BaseLinkProps, "className">) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Use a large number instead of 0 to make sure the line is not visible by
  // default.
  const [width, setWidth] = useState(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    invariant(linkRef.current != null, "linkRef must be set");
    const linkElement = linkRef.current;

    const observer = new ResizeObserver(() => {
      setWidth(linkElement.clientWidth);
    });

    observer.observe(linkElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <BaseLink
      {...rest}
      ref={linkRef}
      isNavLink
      className={({ isActive }) =>
        cn(navLinkClassName({ isActive }), "relative")
      }
    >
      {({ isActive }) => (
        <>
          {children}

          <Transition in={isActive} timeout={150}>
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
