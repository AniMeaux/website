import { DateTime } from "luxon"

import { LargeNav } from "#i/core/layout/navigation/large-nav.js"
import { SmallNav } from "#i/core/layout/navigation/small-nav.js"

export function Header() {
  const displayShowBanner = getDisplayShowBanner()

  return (
    <>
      <SmallNav displayShowBanner={displayShowBanner} />
      <LargeNav displayShowBanner={displayShowBanner} />
    </>
  )
}

function getDisplayShowBanner() {
  if (CLIENT_ENV.FEATURE_FLAG_SHOW_SDA_BANNER !== "true") {
    return false
  }

  if (CLIENT_ENV.SDA_END_DATE == null) {
    return false
  }

  const endDate = DateTime.fromISO(CLIENT_ENV.SDA_END_DATE)
  if (!endDate.isValid) {
    return false
  }

  return DateTime.now() < endDate
}
