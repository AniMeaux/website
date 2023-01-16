import { Animal, Breed, Color, Gender, User } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { forwardRef } from "react";
import { AnimalAvatar } from "~/animals/avatar";
import { GENDER_ICON, GENDER_TRANSLATION } from "~/animals/gender";
import { getAnimalDisplayName } from "~/animals/profile/name";
import {
  hasPastVaccination,
  hasUpCommingSterilisation,
  hasUpCommingVaccination,
} from "~/animals/situation/health";
import { getSpeciesLabels } from "~/animals/species";
import { StatusBadge } from "~/animals/status";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { DynamicImage, DynamicImageProps } from "~/core/dataDisplay/image";
import {
  SuggestionItem,
  SuggestionItemProps,
} from "~/core/formElements/resourceInput";
import { Icon } from "~/generated/icon";

export function AnimalItem({
  animal,
  imageSizes,
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
      | "isSterilizationMandatory"
      | "isSterilized"
      | "name"
      | "nextVaccinationDate"
      | "species"
      | "status"
    >
  > & {
    manager?: null | Pick<User, "displayName">;
  };
  imageSizes: DynamicImageProps["sizes"];
  imageLoading?: DynamicImageProps["loading"];
  className?: string;
}) {
  return (
    <BaseLink
      to={`/animals/${animal.id}`}
      className={cn(
        className,
        "group rounded-1 flex flex-col gap-0.5 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      )}
    >
      <span className="relative flex flex-col">
        <DynamicImage
          loading={imageLoading}
          imageId={animal.avatar}
          alt={animal.name}
          fallbackSize="512"
          sizes={imageSizes}
          className="w-full flex-none rounded-1"
        />

        <span className="absolute bottom-0 left-0 w-full p-0.5 flex justify-end">
          <span className="mr-auto flex gap-0.5">
            {hasPastVaccination(animal) ? (
              <NotificationBadge variant="error">
                <Icon id="syringe" />
              </NotificationBadge>
            ) : null}

            {hasUpCommingVaccination(animal) ? (
              <NotificationBadge variant="warning">
                <Icon id="syringe" />
              </NotificationBadge>
            ) : null}

            {hasUpCommingSterilisation(animal) ? (
              <NotificationBadge variant="warning">
                <Icon id="scissors" />
              </NotificationBadge>
            ) : null}
          </span>

          <StatusBadge status={animal.status} />
        </span>
      </span>

      <div className="flex flex-col">
        <p className="flex items-start gap-0.5">
          <span
            className={cn(
              "h-2 flex-none flex items-center",
              animal.gender === Gender.FEMALE
                ? "text-pink-500"
                : "text-blue-500"
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
                : "group-hover:text-blue-500"
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

type NotificationBadgeVariant = "error" | "warning";

function NotificationBadge({
  variant,
  children,
}: {
  variant: NotificationBadgeVariant;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "h-2 rounded-0.5 px-0.5 flex items-center text-white text-[14px]",
        variant === "error" ? "bg-red-500" : "bg-orange-500"
      )}
    >
      {children}
    </span>
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
      to={`/animals/${animal.id}`}
      className={cn(
        className,
        "group rounded-0.5 grid grid-cols-[auto_minmax(0px,1fr)_auto] items-center gap-1 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      )}
    >
      <AnimalAvatar animal={animal} size="lg" loading={imageLoading} />

      <div className="flex flex-col">
        <p className="flex items-start gap-0.5">
          <span
            className={cn(
              "h-2 flex-none flex items-center",
              animal.gender === Gender.FEMALE
                ? "text-pink-500"
                : "text-blue-500"
            )}
            title={GENDER_TRANSLATION[animal.gender]}
          >
            <Icon id={GENDER_ICON[animal.gender]} />
          </span>

          <span
            className={cn(
              "flex-1 text-body-emphasis truncate transition-colors duration-100 ease-in-out",
              animal.gender === Gender.FEMALE
                ? "group-hover:text-pink-500"
                : "group-hover:text-blue-500"
            )}
          >
            {getAnimalDisplayName(animal)}
          </span>
        </p>

        <p
          className={cn(
            "flex",
            hasError
              ? "text-caption-emphasis text-red-500"
              : "text-caption-default text-gray-500"
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
  HTMLLIElement,
  Omit<SuggestionItemProps, "leftAdornment" | "label" | "secondaryLabel"> & {
    animal: Pick<Animal, "avatar" | "name" | "species"> & {
      highlightedAlias: null | string;
      highlightedName: string;
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
        name: animal.highlightedName,
        alias: animal.highlightedAlias,
      })}
      secondaryLabel={getSpeciesLabels(animal)}
    />
  );
});
