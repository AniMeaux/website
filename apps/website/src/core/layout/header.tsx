import { DateTime } from "luxon"

import { LargeNav } from "#i/core/layout/navigation/large-nav.js"
import { SmallNav } from "#i/core/layout/navigation/small-nav.js"

const SHOW_CLOSING_TIME = DateTime.fromISO("2026-06-07T18:00:00.000+02:00")

export function Header() {
  const hasShowEnded = DateTime.now() >= SHOW_CLOSING_TIME

  return (
    <>
      <SmallNav displayShowBanner={!hasShowEnded} />
      <LargeNav displayShowBanner={!hasShowEnded} />
    </>
  )
}
