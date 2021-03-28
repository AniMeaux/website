import { Link } from "@animeaux/ui-library/build/core/link";
import * as React from "react";
import NameAndLogo from "../../ui/nameAndLogo.svg";
import { Navigation } from "../navigation";

export function Header() {
  return (
    <header className="Header">
      <Link href="/" className="HeaderLogo">
        <NameAndLogo />
      </Link>

      <Navigation />
    </header>
  );
}
