import * as React from "react";
import { Navigation } from "~/layout/navigation";
import { Link } from "~/core/link";
import Logo from "~/core/logo.svg";
import NameAndLogo from "~/core/nameAndLogo.svg";

export function Header() {
  return (
    <header className="Header">
      <Link href="/" className="HeaderLogoLink">
        <NameAndLogo className="HeaderNameAndLogo" />
        <Logo className="HeaderLogo" />
      </Link>

      <Navigation />
    </header>
  );
}
