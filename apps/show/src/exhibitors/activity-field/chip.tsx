import { Chip } from "#core/data-display/chip";
import { ActivityField } from "#exhibitors/activity-field/activity-field";
import { Icon } from "#generated/icon";

export function ChipActivityField({
  activityField,
  isHighlighted = false,
  className,
}: {
  activityField: ActivityField.Enum;
  isHighlighted?: boolean;
  className?: string;
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
  );
}
