import { Link } from "core/link";
import Logo from "core/logo.svg";
import NameAndLogo from "core/nameAndLogo.svg";
import { Navigation } from "layout/navigation";

export function Header() {
  return (
    <header className="Header">
      <Link href="/" className="HeaderLogoLink" aria-label="Accueil">
        <NameAndLogo className="HeaderNameAndLogo" />
        <Logo className="HeaderLogo" />
      </Link>

      <Navigation />
    </header>
  );
}
