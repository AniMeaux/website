import { BaseLink, BaseLinkProps } from "#/core/baseLink";
import { cn } from "#/core/classNames";
import { useWidth } from "#/core/hooks";
import nameAndLogo from "#/images/nameAndLogo.svg";
import { LineShapeHorizontal } from "#/layout/lineShape";
import { navLinkClassName } from "#/layout/navigation/shared";
import { SocialLinks } from "#/layout/navigation/socialLinks";
import { Transition } from "react-transition-group";

export function LargeNav() {
  return (
    <header
      className={cn(
        "z-[0] w-full pt-safe-2 px-page pb-2 hidden items-center justify-between",
        "md:flex"
      )}
    >
      <BaseLink to="/" className="flex">
        <img src={nameAndLogo} alt="Salon des Ani’Meaux" className="h-[40px]" />
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
                  "absolute bottom-0 left-0 w-full h-1 block text-brandBlue",
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
