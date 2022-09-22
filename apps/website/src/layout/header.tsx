import { LargeNav } from "~/layout/navigation/largeNav";
import { SmallNav } from "~/layout/navigation/smallNav";

export function Header() {
  return (
    <>
      <SmallNav />
      <LargeNav />
    </>
  );
}
