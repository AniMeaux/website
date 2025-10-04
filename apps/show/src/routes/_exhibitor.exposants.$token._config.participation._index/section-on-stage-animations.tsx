import { ProseInlineAction } from "#core/actions/prose-inline-action";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown.js";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { LightBoardCard } from "#core/layout/light-board-card";
import { ChipActivityTarget } from "#exhibitors/activity-target/chip.js";
import { joinReactNodes } from "@animeaux/core";
import type { ShowActivityTarget } from "@prisma/client";
import { ShowStandZone } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./route";
import { SectionId } from "./section-id";

export function SectionOnStageAnimations() {
  const { exhibitor, animations } = useLoaderData<typeof loader>();

  return (
    <FormLayout.Section id={SectionId.ON_STAGE_ANIMATIONS}>
      <FormLayout.Title>Animations sur scène</FormLayout.Title>

      <HelperCard.Root color="alabaster">
        <p>
          Vous avez la possibilité d’organiser une animation sur scène (débat,
          conférence, animation participative, etc…), sous réserve de la
          disponibilité des créneaux. Contactez-nous par e-mail à{" "}
          <ProseInlineAction asChild>
            <a href="mailto:salon@animeaux.org">salon@animeaux.org</a>
          </ProseInlineAction>{" "}
          pour mettre en place une animation !
        </p>
      </HelperCard.Root>

      {animations.length === 0 ? (
        <LightBoardCard isSmall>
          <p>Aucune animation sur scène prévue.</p>
        </LightBoardCard>
      ) : (
        animations.map((animation) => (
          <AnimationItem
            key={animation.id}
            id={exhibitor.id}
            animation={animation}
          />
        ))
      )}
    </FormLayout.Section>
  );
}

function AnimationItem({
  id,
  animation,
}: {
  id: string;
  animation: {
    animators: {
      url: string;
      id: string;
      name: string;
    }[];
    id: string;
    description: string;
    endTime: string;
    registrationUrl: string | null;
    startTime: string;
    targets: ShowActivityTarget[];
    zone: ShowStandZone;
  };
}) {
  const otherAnimators = animation.animators.filter(
    (animator) => animator.id !== id,
  );

  const startTime = DateTime.fromISO(animation.startTime);

  const duration = DateTime.fromISO(animation.endTime).diff(
    startTime,
    "minutes",
  );

  return (
    <section className="grid grid-cols-1 gap-2 rounded-2 border border-mystic-200 px-2 py-1">
      <div className="grid grid-cols-1 gap-0.5">
        <div className="grid grid-cols-fr-auto items-center gap-2">
          <span>
            <span className="capitalize">
              {startTime.toLocaleString({
                weekday: "long",
                hour: "numeric",
                minute: "numeric",
              })}
            </span>
            {" • "}
            {duration.toHuman({ unitDisplay: "short" })}
          </span>

          <span>{STAND_ZONE_TRANSLATION[animation.zone]}</span>
        </div>

        {animation.targets.length > 0 ? (
          <ul className="flex flex-wrap gap-0.5">
            {animation.targets.map((activityTarget) => (
              <ChipActivityTarget
                key={activityTarget}
                activityTarget={activityTarget}
                className="flex-none"
              />
            ))}
          </ul>
        ) : null}
      </div>

      <p className="text-body-lowercase-emphasis">
        <Markdown
          content={animation.description}
          components={SENTENCE_COMPONENTS}
        />
      </p>

      {otherAnimators.length > 0 ? (
        <p>
          <span className="text-caption-lowercase-default">Avec :{" "}</span>

          {joinReactNodes(
            otherAnimators.map((animator) => (
              <ProseInlineAction key={animator.id} variant="subtle" asChild>
                <Link to={animator.url} className="uppercase">
                  {animator.name}
                </Link>
              </ProseInlineAction>
            )),
            ", ",
          )}
        </p>
      ) : null}

      {animation.registrationUrl != null ? (
        <p className="grid grid-cols-1 md:inline">
          <span className="text-caption-lowercase-default">
            Liens d’inscription :{" "}
          </span>

          <ProseInlineAction variant="subtle" asChild>
            <Link to={animation.registrationUrl}>
              {animation.registrationUrl}
            </Link>
          </ProseInlineAction>
        </p>
      ) : null}
    </section>
  );
}

const STAND_ZONE_TRANSLATION: Record<ShowStandZone, string> = {
  [ShowStandZone.INSIDE]: "Intérieur",
  [ShowStandZone.OUTSIDE]: "Extérieur",
};
