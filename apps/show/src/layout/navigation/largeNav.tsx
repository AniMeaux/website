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

function useWidth<TElement extends HTMLElement>() {
  const ref = useRef<TElement>(null);

  // Use a large number instead of 0 to make sure the line is not visible by
  // default.
  const [width, setWidth] = useState(Number.MAX_SAFE_INTEGER);

  useEffect(() => {
    invariant(ref.current != null, "ref must be set");
    const buttonElement = ref.current;

    const observer = new ResizeObserver(() => {
      setWidth(buttonElement.clientWidth);
    });

    observer.observe(buttonElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, width };
}

function NavLink({
  to,
  children,
}: {
  to: BaseLinkProps["to"];
  children: BaseLinkProps["children"];
}) {
  const { ref, width } = useWidth<HTMLAnchorElement>();

  return (
    <BaseLink
      to={to}
      ref={ref}
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
