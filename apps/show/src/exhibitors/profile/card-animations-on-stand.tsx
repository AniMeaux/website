import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { Icon } from "#generated/icon";

export function CardAnimationsOnStand({
  onStandAnimations,
}: {
  onStandAnimations: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-1 bg-alabaster px-2 py-1">
      <p className="grid grid-cols-auto-fr items-start gap-0.5 text-mystic text-body-lowercase-emphasis">
        <span className="flex h-2 items-center">
          <Icon id="calendar-day-solid" />
        </span>

        <span>Animations sur stand</span>
      </p>

      <p>
        <Markdown
          content={onStandAnimations}
          components={SENTENCE_COMPONENTS}
        />
      </p>
    </div>
  );
}
