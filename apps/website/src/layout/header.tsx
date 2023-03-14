import { DateTime } from "luxon";
import { LargeNav } from "~/layout/navigation/largeNav";
import { SmallNav } from "~/layout/navigation/smallNav";

const SHOW_CLOSING_TIME = DateTime.fromISO("2023-06-11T18:00:00.000+02:00");

export function Header() {
  const hasShowEnded = DateTime.now() >= SHOW_CLOSING_TIME;

  return (
    <>
      <SmallNav displayShowBanner={!hasShowEnded} />
      <LargeNav displayShowBanner={!hasShowEnded} />
    </>
  );
}
