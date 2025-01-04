import { Chip } from "#core/data-display/chip";
import {
  ACTIVITY_FIELD_ICON,
  ACTIVITY_FIELD_TRANSLATION,
} from "#exhibitors/activity-field/activity-field";
import { Icon } from "#generated/icon";
import type { ShowActivityField } from "@prisma/client";

export function ChipActivityField({
  activityField,
  isHighlighted = false,
  className,
}: {
  activityField: ShowActivityField;
  isHighlighted?: boolean;
  className?: string;
}) {
  return (
    <Chip.Root isHighlighted={isHighlighted} className={className}>
      <Chip.Icon asChild>
        <Icon id={ACTIVITY_FIELD_ICON[activityField].light} />
      </Chip.Icon>

      <Chip.IconHighlighted asChild>
        <Icon id={ACTIVITY_FIELD_ICON[activityField].solid} />
      </Chip.IconHighlighted>

      <Chip.Label>{ACTIVITY_FIELD_TRANSLATION[activityField]}</Chip.Label>
    </Chip.Root>
  );
}
