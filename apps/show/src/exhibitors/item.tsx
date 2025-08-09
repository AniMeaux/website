import { Chip } from "#core/data-display/chip";
import { IconInline } from "#core/data-display/icon-inline";
import { DynamicImage } from "#core/data-display/image";
import { ImageData } from "#core/image/data.js";
import { ChipActivityField } from "#exhibitors/activity-field/chip";
import { ChipActivityTarget } from "#exhibitors/activity-target/chip";
import { CardAnimationsOnStand } from "#exhibitors/profile/card-animations-on-stand";
import {
  ExhibitorSearchParamsN,
  useExhibitorSearchParams,
} from "#exhibitors/search-params";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import type { ShowActivityField, ShowActivityTarget } from "@prisma/client";
import { Link } from "@remix-run/react";

export function ExhibitorItem({
  exhibitor,
  imageLoading,
  imageSizes,
  className,
}: {
  exhibitor: {
    activityFields: ShowActivityField[];
    activityTargets: ShowActivityTarget[];
    hasOnStageAnimation: boolean;
    isSponsor: boolean;
    isOrganizer: boolean;
    logoPath: string;
    name: string;
    onStandAnimations?: string;
    url: string;
  };
  imageLoading: NonNullable<
    React.ComponentPropsWithoutRef<typeof DynamicImage>["loading"]
  >;
  imageSizes: React.ComponentPropsWithoutRef<typeof DynamicImage>["sizes"];
  className?: string;
}) {
  const { exhibitorSearchParams } = useExhibitorSearchParams();

  return (
    <li className={cn("grid grid-cols-1 gap-2", className)}>
      <Link
        to={exhibitor.url}
        className="group/item grid grid-cols-1 gap-2 rounded-b-0.5 rounded-t-2 can-hover:focus-visible:focus-spaced"
      >
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-2 border border-alabaster">
          <DynamicImage
            image={ImageData.parse(exhibitor.logoPath)}
            fillTransparentBackground
            alt={exhibitor.name}
            loading={imageLoading}
            aspectRatio="4:3"
            objectFit="contain"
            fallbackSize="512"
            sizes={imageSizes}
            className="w-full transition-transform duration-slow can-hover:group-hover/item:scale-105"
          />
        </div>

        <div className="grid grid-cols-1 gap-0.5">
          <p className="text-body-uppercase-emphasis">
            {exhibitor.name}

            {exhibitor.isOrganizer ? (
              <>
                &nbsp;
                <IconInline
                  id="show-circle-solid"
                  title="Organisateur du Salon des Ani’Meaux"
                />
              </>
            ) : exhibitor.isSponsor ? (
              <>
                &nbsp;
                <IconInline
                  id="award-solid"
                  title="Sponsor du Salon des Ani’Meaux"
                />
              </>
            ) : null}
          </p>

          <ul className="flex flex-wrap gap-0.5">
            {exhibitor.hasOnStageAnimation ? (
              <Chip.Root
                isHighlighted={exhibitorSearchParams.eventTypes.has(
                  ExhibitorSearchParamsN.EventType.Enum.ON_STAGE,
                )}
                className="flex-none"
              >
                <Chip.Icon asChild>
                  <Icon
                    id={
                      ExhibitorSearchParamsN.EventType.icon[
                        ExhibitorSearchParamsN.EventType.Enum.ON_STAGE
                      ].light
                    }
                  />
                </Chip.Icon>

                <Chip.IconHighlighted asChild>
                  <Icon
                    id={
                      ExhibitorSearchParamsN.EventType.icon[
                        ExhibitorSearchParamsN.EventType.Enum.ON_STAGE
                      ].solid
                    }
                  />
                </Chip.IconHighlighted>

                <Chip.Label>
                  {
                    ExhibitorSearchParamsN.EventType.translationLong[
                      ExhibitorSearchParamsN.EventType.Enum.ON_STAGE
                    ]
                  }
                </Chip.Label>
              </Chip.Root>
            ) : null}

            {exhibitor.activityFields.map((activityField) => (
              <ChipActivityField
                key={activityField}
                activityField={activityField}
                isHighlighted={exhibitorSearchParams.fields.has(activityField)}
                className="flex-none"
              />
            ))}

            {exhibitor.activityTargets.map((activityTarget) => (
              <ChipActivityTarget
                key={activityTarget}
                activityTarget={activityTarget}
                isHighlighted={exhibitorSearchParams.targets.has(
                  activityTarget,
                )}
                className="flex-none"
              />
            ))}
          </ul>
        </div>
      </Link>

      {exhibitor.onStandAnimations != null ? (
        <CardAnimationsOnStand
          onStandAnimations={exhibitor.onStandAnimations}
        />
      ) : null}
    </li>
  );
}
