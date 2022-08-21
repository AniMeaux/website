import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import nameAndLogo from "~/images/nameAndLogo.svg";
import { NavLink } from "~/layout/navigation/shared";
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

      <nav className="flex lg:gap-2">
        <NavLink to="/exposants">Exposants</NavLink>
        <NavLink to="/programme">Programme</NavLink>
        <NavLink to="/#acces">Accès</NavLink>
        <NavLink to="/faq">FAQ</NavLink>
      </nav>

      <div className="flex">
        <SocialLinks />
      </div>
    </header>
  );
}
