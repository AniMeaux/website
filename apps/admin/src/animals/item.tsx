import { AnimalAvatar } from "#animals/avatar.tsx";
import { GENDER_ICON, GENDER_TRANSLATION } from "#animals/gender.tsx";
import { getAnimalDisplayName } from "#animals/profile/name.tsx";
import {
  getNextVaccinationState,
  hasUpCommingSterilisation,
} from "#animals/situation/health.ts";
import { getSpeciesLabels } from "#animals/species.tsx";
import { StatusBadge } from "#animals/status.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { Chip } from "#core/dataDisplay/chip.tsx";
import type { DynamicImageProps } from "#core/dataDisplay/image.tsx";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import type { SuggestionItemProps } from "#core/formElements/resourceInput.tsx";
import { SuggestionItem } from "#core/formElements/resourceInput.tsx";
import { Routes } from "#core/navigation.ts";
import { Icon } from "#generated/icon.tsx";
import type { AnimalHit } from "@animeaux/algolia-client";
import { cn } from "@animeaux/core";
import type { Animal, Breed, Color, User } from "@prisma/client";
import { Gender } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { forwardRef } from "react";

export function AnimalItem({
  animal,
  imageSizeMapping,
  imageLoading,
  className,
}: {
  animal: SerializeFrom<
    Pick<
      Animal,
      | "alias"
      | "avatar"
      | "birthdate"
      | "gender"
      | "id"
      | "name"
      | "species"
      | "status"
    > &
      Partial<
        Pick<
          Animal,
          "isSterilizationMandatory" | "isSterilized" | "nextVaccinationDate"
        >
      > & {
        manager?: null | Pick<User, "displayName">;
      }
  >;
  imageSizeMapping: DynamicImageProps["sizeMapping"];
  imageLoading?: DynamicImageProps["loading"];
  className?: string;
}) {
  let vaccinationChip: React.ReactNode;

  if (animal.nextVaccinationDate != null) {
    const state = getNextVaccinationState(animal.nextVaccinationDate);

    switch (state) {
      case "past": {
        vaccinationChip = (
          <Chip color="red" icon="syringe" title="Date de vaccination passée" />
        );

        break;
      }

      case "up-comming": {
        vaccinationChip = (
          <Chip color="orange" icon="syringe" title="Vaccination prévue" />
        );
        break;
      }
    }
  }

  return (
    <BaseLink
      to={Routes.animals.id(animal.id).toString()}
      className={cn(
        className,
        "rounded-1.5 md:rounded-2 p-0.5 md:p-1 flex flex-col gap-0.5 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 bg-white hover:bg-gray-100 focus-visible:z-10",
      )}
    >
      <span className="relative flex flex-col">
        <DynamicImage
          loading={imageLoading}
          imageId={animal.avatar}
          alt={animal.name}
          fallbackSize="512"
          sizeMapping={imageSizeMapping}
          className="w-full flex-none rounded-1"
        />

        <span className="absolute bottom-0 left-0 w-full p-0.5 flex justify-end">
          <span className="mr-auto flex gap-0.5">
            {vaccinationChip}

            {hasUpCommingSterilisation(animal) ? (
              <Chip
                color="orange"
                icon="scissors"
                title="Stérilisation à prévoir"
              />
            ) : null}
          </span>

          <StatusBadge status={animal.status} />
        </span>
      </span>

      <div className="flex flex-col">
        <p className="flex items-start gap-0.25">
          <span
            className={cn(
              "h-2 flex-none flex items-center",
              animal.gender === Gender.FEMALE
                ? "text-pink-500"
                : "text-blue-500",
            )}
            title={GENDER_TRANSLATION[animal.gender]}
          >
            <Icon id={GENDER_ICON[animal.gender]} />
          </span>

          <span
            className={cn(
              "flex-1 text-body-emphasis transition-colors duration-100 ease-in-out",
              animal.gender === Gender.FEMALE
                ? "group-hover:text-pink-500"
                : "group-hover:text-blue-500",
            )}
          >
            {getAnimalDisplayName(animal)}
          </span>
        </p>

        {animal.manager != null ? (
          <p className="flex text-caption-default text-gray-500">
            {animal.manager.displayName}
          </p>
        ) : null}
      </div>
    </BaseLink>
  );
}

export function AnimalSmallItem({
  animal,
  imageLoading,
  secondaryLabel,
  hasError = false,
  className,
}: {
  animal: Pick<
    Animal,
    "id" | "name" | "alias" | "gender" | "avatar" | "status"
  >;
  secondaryLabel: React.ReactNode;
  imageLoading?: DynamicImageProps["loading"];
  hasError?: boolean;
  className?: string;
}) {
  return (
    <BaseLink
      to={Routes.animals.id(animal.id).toString()}
      className={cn(
        className,
        "rounded-0.5 px-0.5 md:px-1 py-1 grid grid-cols-[auto_minmax(0px,1fr)_auto] items-center gap-1 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 bg-white bg-var-white hover:bg-gray-100 hover:bg-var-gray-100 focus-visible:z-10",
      )}
    >
      <AnimalAvatar animal={animal} size="md" loading={imageLoading} />

      <div className="flex flex-col">
        <p className="flex items-start gap-0.25">
          <span
            className={cn(
              "h-2 flex-none flex items-center",
              animal.gender === Gender.FEMALE
                ? "text-pink-500"
                : "text-blue-500",
            )}
            title={GENDER_TRANSLATION[animal.gender]}
          >
            <Icon id={GENDER_ICON[animal.gender]} />
          </span>

          <span className="flex-1 text-body-emphasis truncate">
            {getAnimalDisplayName(animal)}
          </span>
        </p>

        <p
          className={cn(
            "flex",
            hasError
              ? "text-caption-emphasis text-red-500"
              : "text-caption-default text-gray-500",
          )}
        >
          {secondaryLabel}
        </p>
      </div>

      <StatusBadge status={animal.status} />
    </BaseLink>
  );
}

export const AnimalSuggestionItem = forwardRef<
  React.ComponentRef<typeof SuggestionItem>,
  Omit<SuggestionItemProps, "leftAdornment" | "label" | "secondaryLabel"> & {
    animal: Pick<Animal, "avatar"> &
      Pick<AnimalHit, "_highlighted" | "alias" | "id" | "name" | "species"> & {
        breed: null | Pick<Breed, "name">;
        color: null | Pick<Color, "name">;
      };
  }
>(function AnimalSuggestionItem({ animal, ...rest }, ref) {
  return (
    <SuggestionItem
      {...rest}
      ref={ref}
      leftAdornment={<AnimalAvatar animal={animal} loading="eager" />}
      label={getAnimalDisplayName({
        name: animal._highlighted.name,
        alias: animal._highlighted.alias,
      })}
      secondaryLabel={getSpeciesLabels(animal)}
    />
  );
});
