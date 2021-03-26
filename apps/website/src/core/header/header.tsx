import { Link } from "@animeaux/ui-library/build/core/link";
import * as React from "react";
import NameAndLogo from "../../ui/nameAndLogo.svg";
import { Navigation } from "../navigation";

export function Header() {
  return (
    <header className="header">
      <Link href="/" className="header__nameAndlogo">
        <NameAndLogo />
      </Link>

      <Navigation />
    </header>
  );
}
