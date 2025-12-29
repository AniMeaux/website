import { AnimalAvatar } from "#animals/avatar";
import { GENDER_ICON, GENDER_TRANSLATION } from "#animals/gender";
import { getAnimalDisplayName } from "#animals/profile/name";
import {
  getNextVaccinationState,
  hasUpCommingSterilisation,
} from "#animals/situation/health";
import { getSpeciesLabels } from "#animals/species";
import { StatusBadge } from "#animals/status";
import { BaseLink } from "#core/base-link";
import { Chip } from "#core/data-display/chip";
import type { DynamicImageProps } from "#core/data-display/image";
import { DynamicImage } from "#core/data-display/image";
import type { SuggestionItemProps } from "#core/form-elements/resource-input";
import { SuggestionItem } from "#core/form-elements/resource-input";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import type { Animal, Species, User } from "@animeaux/prisma";
import { Gender } from "@animeaux/prisma";
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
    const state = getNextVaccinationState(
      animal.nextVaccinationDate,
      animal.status,
    );

    switch (state) {
      case "past": {
        vaccinationChip = (
          <Chip
            variant="primary"
            color="red"
            icon="icon-syringe-solid"
            title="Date de vaccination passée"
          />
        );

        break;
      }

      case "up-comming": {
        vaccinationChip = (
          <Chip
            variant="primary"
            color="orange"
            icon="icon-syringe-solid"
            title="Vaccination prévue"
          />
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
        "flex flex-col gap-0.5 rounded-1.5 bg-white p-0.5 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:rounded-2 md:p-1",
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

        <span className="absolute bottom-0 left-0 flex w-full justify-end p-0.5">
          <span className="mr-auto flex gap-0.5">
            {vaccinationChip}

            {hasUpCommingSterilisation(animal) ? (
              <Chip
                variant="primary"
                color="orange"
                icon="icon-scissors-solid"
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
              "flex h-2 flex-none items-center",
              animal.gender === Gender.FEMALE
                ? "text-pink-500"
                : "text-blue-500",
            )}
            title={GENDER_TRANSLATION[animal.gender]}
          >
            <Icon href={GENDER_ICON[animal.gender].solid} />
          </span>

          <span className="flex-1 transition-colors duration-100 ease-in-out text-body-emphasis">
            {getAnimalDisplayName(animal)}
          </span>
        </p>

        {animal.manager != null ? (
          <p className="flex text-gray-500 text-caption-default">
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
        "grid grid-cols-[auto_minmax(0px,1fr)_auto] items-center gap-1 rounded-0.5 bg-white px-0.5 py-1 focus-visible:z-10 focus-visible:focus-compact-blue-400 hover:bg-gray-100 md:px-1",
      )}
    >
      <AnimalAvatar animal={animal} size="md" loading={imageLoading} />

      <div className="flex flex-col">
        <p className="flex items-start gap-0.25">
          <span
            className={cn(
              "flex h-2 flex-none items-center",
              animal.gender === Gender.FEMALE
                ? "text-pink-500"
                : "text-blue-500",
            )}
            title={GENDER_TRANSLATION[animal.gender]}
          >
            <Icon href={GENDER_ICON[animal.gender].solid} />
          </span>

          <span className="flex-1 truncate text-body-emphasis">
            {getAnimalDisplayName(animal)}
          </span>
        </p>

        <p
          className={cn(
            "flex",
            hasError
              ? "text-red-500 text-caption-emphasis"
              : "text-gray-500 text-caption-default",
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
    animal: {
      avatar: string;
      alias: string | null;
      name: string;
      id: string;
      species: Species;
      breed: null | { name: string };
      color: null | { name: string };
    };
  }
>(function AnimalSuggestionItem({ animal, ...rest }, ref) {
  return (
    <SuggestionItem
      {...rest}
      ref={ref}
      leftAdornment={<AnimalAvatar animal={animal} loading="eager" />}
      label={getAnimalDisplayName({
        name: animal.name,
        alias: animal.alias,
      })}
      secondaryLabel={getSpeciesLabels(animal)}
    />
  );
});
