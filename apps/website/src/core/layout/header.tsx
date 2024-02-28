import { LargeNav } from "#core/layout/navigation/large-nav";
import { SmallNav } from "#core/layout/navigation/small-nav";
import { DateTime } from "luxon";

const SHOW_CLOSING_TIME = DateTime.fromISO("2024-06-09T18:00:00.000+02:00");

export function Header() {
  const hasShowEnded = DateTime.now() >= SHOW_CLOSING_TIME;

  return (
    <>
      <SmallNav displayShowBanner={!hasShowEnded} />
      <LargeNav displayShowBanner={!hasShowEnded} />
    </>
  );
}
