import cn from "classnames";
import * as React from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Link, LinkProps } from "~/core/link";
import { ChildrenProp } from "~/core/types";
import { ActMenu, AdoptionMenu } from "./shared";

export function LargeNavigation() {
  return (
    <nav className="LargeNavigation">
      <NavigationMenu label="Adoption">
        <AdoptionMenu />
      </NavigationMenu>

      <NavigationMenu label="Agir">
        <ActMenu />
      </NavigationMenu>

      <NavigationLink href="/">Partenaires</NavigationLink>
      <NavigationLink href="/">Blog</NavigationLink>
    </nav>
  );
}

type NavigationLinkProps = LinkProps;
function NavigationLink(props: NavigationLinkProps) {
  return <Link {...props} className="LargeNavigationItem" />;
}

type NavigationButtonProps = ChildrenProp & {
  refProp: React.RefObject<HTMLButtonElement>;
  onClick?: () => void;
};

function NavigationButton({
  onClick,
  refProp,
  ...rest
}: NavigationButtonProps) {
  return (
    <button
      {...rest}
      ref={refProp}
      className="LargeNavigationItem"
      onClick={onClick}
    />
  );
}

type NavigationMenuProps = ChildrenProp & {
  label: string;
};

function NavigationMenu({ label, ...rest }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const navRef = React.useRef<HTMLDivElement>(null!);

  React.useEffect(() => {
    if (!isOpen) {
      const navElement = navRef.current;
      navElement.setAttribute("inert", "");

      return () => {
        navElement.removeAttribute("inert");
      };
    }
  }, [isOpen]);

  const navigationRootRef = React.useRef<HTMLDivElement>(null!);
  const buttonRef = React.useRef<HTMLButtonElement>(null!);

  return (
    <div
      ref={navigationRootRef}
      className="LargeNavigationMenu"
      onBlur={(event) => {
        if (
          event.relatedTarget == null ||
          !navigationRootRef.current.contains(event.relatedTarget as Node)
        ) {
          setIsOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.preventDefault();
          setIsOpen(false);
          buttonRef.current.focus();
        }
      }}
    >
      <NavigationButton
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        refProp={buttonRef}
      >
        <span>{label}</span> {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </NavigationButton>

      <div
        {...rest}
        ref={navRef}
        tabIndex={-1}
        className={cn("LargeNavigationMenu__content", {
          "LargeNavigationMenu__content--open": isOpen,
        })}
      />
    </div>
  );
}
