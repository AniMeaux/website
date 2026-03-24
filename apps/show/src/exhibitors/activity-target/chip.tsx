import type { ShowActivityTarget } from "@animeaux/prisma"

import { Chip } from "#i/core/data-display/chip.js"
import {
  ACTIVITY_TARGET_ICON,
  ACTIVITY_TARGET_TRANSLATION,
} from "#i/exhibitors/activity-target/activity-target.js"
import { Icon } from "#i/generated/icon.js"

export function ChipActivityTarget({
  activityTarget,
  isHighlighted = false,
  className,
}: {
  activityTarget: ShowActivityTarget
  isHighlighted?: boolean
  className?: string
}) {
  return (
    <Chip.Root isHighlighted={isHighlighted} className={className}>
      <Chip.Icon asChild>
        <Icon id={ACTIVITY_TARGET_ICON[activityTarget].light} />
      </Chip.Icon>

      <Chip.IconHighlighted asChild>
        <Icon id={ACTIVITY_TARGET_ICON[activityTarget].solid} />
      </Chip.IconHighlighted>

      <Chip.Label>{ACTIVITY_TARGET_TRANSLATION[activityTarget]}</Chip.Label>
    </Chip.Root>
  )
}
