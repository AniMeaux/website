import cn from "classnames";
import * as React from "react";
import { FaAngleDown, FaAngleUp, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "~/core/link";
import { ChildrenProp } from "~/core/types";
import { ActMenu, AdoptionMenu } from "./shared";

type MenuType = "none" | "adopt" | "act";

export function SmallNavigation() {
  const [isNavigationOpen, setIsNavigationOpen] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null!);
  const [openMenu, setOpenMenu] = React.useState<MenuType>("none");

  React.useEffect(() => {
    if (!isNavigationOpen) {
      const navElement = navRef.current;
      navElement.setAttribute("inert", "");
      setOpenMenu("none");

      return () => {
        navElement.removeAttribute("inert");
      };
    }
  }, [isNavigationOpen]);

  const navigationRootRef = React.useRef<HTMLDivElement>(null!);
  const buttonRef = React.useRef<HTMLButtonElement>(null!);

  return (
    <div
      ref={navigationRootRef}
      onBlur={(event) => {
        if (
          event.relatedTarget == null ||
          !navigationRootRef.current.contains(event.relatedTarget as Node)
        ) {
          setIsNavigationOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isNavigationOpen) {
          event.preventDefault();
          setIsNavigationOpen(false);
          buttonRef.current.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        className="SmallNavigation__button"
        onClick={() => {
          setIsNavigationOpen((isNavigationOpen) => !isNavigationOpen);
          // Safari doesn't focus on click.
          buttonRef.current.focus();
        }}
      >
        {isNavigationOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav
        ref={navRef}
        tabIndex={-1}
        className={cn("SmallNavigation__nav", {
          "SmallNavigation__nav--open": isNavigationOpen,
        })}
      >
        <ul>
          <li>
            <NavigationMenu
              label="Adoption"
              isOpen={openMenu === "adopt"}
              onToggleOpen={(isOpen) => setOpenMenu(isOpen ? "adopt" : "none")}
            >
              <AdoptionMenu />
            </NavigationMenu>
          </li>

          <li>
            <NavigationMenu
              label="Agir"
              isOpen={openMenu === "act"}
              onToggleOpen={(isOpen) => setOpenMenu(isOpen ? "act" : "none")}
            >
              <ActMenu />
            </NavigationMenu>
          </li>

          <li>
            <NavigationLink>Partenaires</NavigationLink>
          </li>

          <li>
            <NavigationLink>Blog</NavigationLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function NavigationLink(props: ChildrenProp) {
  return <Link {...props} href="/" className="SmallNavigationItem" />;
}

type NavigationButtonProps = ChildrenProp & {
  onClick?: () => void;
};

function NavigationButton({ onClick, ...rest }: NavigationButtonProps) {
  return <button {...rest} className="SmallNavigationItem" onClick={onClick} />;
}

type NavigationMenuProps = ChildrenProp & {
  isOpen: boolean;
  onToggleOpen: (isOpen: boolean) => void;
  label: string;
};

function NavigationMenu({
  label,
  isOpen,
  onToggleOpen,
  ...rest
}: NavigationMenuProps) {
  return (
    <div>
      <NavigationButton onClick={() => onToggleOpen(!isOpen)}>
        <span>{label}</span> {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </NavigationButton>

      <div
        {...rest}
        className={cn("SmallNavigationMenu", {
          "SmallNavigationMenu--open": isOpen,
        })}
      />
    </div>
  );
}
