import { Link } from "@animeaux/ui-library/build/core/link";
import * as React from "react";
import Logo from "../../ui/logo.svg";
import NameAndLogo from "../../ui/nameAndLogo.svg";
import { Navigation } from "../navigation";

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
