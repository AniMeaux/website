import { useEffect, useState } from "react";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import logo from "~/images/logo.svg";
import nameAndLogo from "~/images/nameAndLogo.svg";
import { LargeNav } from "~/layout/navigation/largeNav";
import { SmallNav } from "~/layout/navigation/smallNav";

export function Header() {
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setHasScroll(window.scrollY > 0);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-0 w-full bg-gray-50 px-page py-2 flex items-center justify-between transition-colors duration-100",
        {
          "bg-opacity-95 backdrop-blur-lg ease-out": hasScroll,
          "bg-opacity-0 ease-in": !hasScroll,
        }
      )}
    >
      <BaseLink to="/" className="flex">
        <picture>
          <source srcSet={nameAndLogo} media="(min-width: 640px)" />
          <img src={logo} alt="Ani'Meaux" className="h-[40px]" />
        </picture>
      </BaseLink>

      <SmallNav />
      <LargeNav />
    </header>
  );
}
