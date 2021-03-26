import * as React from "react";
import { ScreenSize, useScreenSize } from "../screenSize";
import { LargeNavigation } from "./largeNavigation";
import { SmallNavigation } from "./smallNavigation";

export function Navigation() {
  const { screenSize } = useScreenSize();

  if (screenSize >= ScreenSize.MEDIUM) {
    return <LargeNavigation />;
  }

  if (screenSize === ScreenSize.SMALL) {
    return <SmallNavigation />;
  }

  return null;
}
