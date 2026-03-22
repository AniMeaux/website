import { Chip } from "#i/core/data-display/chip.js"
import { ActivityField } from "#i/exhibitors/activity-field/activity-field.js"
import { Icon } from "#i/generated/icon.js"

export function ChipActivityField({
  activityField,
  isHighlighted = false,
  className,
}: {
  activityField: ActivityField.Enum
  isHighlighted?: boolean
  className?: string
}) {
  return (
    <Chip.Root isHighlighted={isHighlighted} className={className}>
      <Chip.Icon asChild>
        <Icon id={ActivityField.icon[activityField].light} />
      </Chip.Icon>

      <Chip.IconHighlighted asChild>
        <Icon id={ActivityField.icon[activityField].solid} />
      </Chip.IconHighlighted>

      <Chip.Label>{ActivityField.translation[activityField]}</Chip.Label>
    </Chip.Root>
  )
}
