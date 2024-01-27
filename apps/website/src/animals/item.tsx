import { BaseLink } from "#core/baseLink.tsx";
import { DynamicImage } from "#core/dataDisplay/image.tsx";
import { isDefined } from "#core/isDefined.ts";
import { toSlug } from "#core/slugs.ts";
import { GENDER_TRANSLATION, SPECIES_TRANSLATION } from "#core/translations.ts";
import { Icon } from "#generated/icon.tsx";
import { cn, formatAge } from "@animeaux/core";
import type { Species } from "@prisma/client";
import { Gender } from "@prisma/client";

export function AnimalItem({
  isDisabled = false,
  animal,
}: {
  isDisabled?: boolean;
  animal: {
    id: string;
    species: Species;
    name: string;
    birthdate: string;
    gender: Gender;
    breed: { name: string } | null;
    color: { name: string } | null;
    avatar: string;
  };
}) {
  const speciesLabels = [
    SPECIES_TRANSLATION[animal.species],
    animal.breed?.name,
    animal.color?.name,
  ]
    .filter(isDefined)
    .join(" • ");

  return (
    <li className="flex">
      <BaseLink
        to={
          isDisabled ? undefined : `/animal/${toSlug(animal.name)}-${animal.id}`
        }
        className="group flex w-full flex-col gap-3 rounded-bubble-md"
      >
        <DynamicImage
          imageId={animal.avatar}
          alt={animal.name}
          sizes={{ lg: "300px", sm: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="aspect-4/3 w-full flex-none rounded-bubble-md"
        />

        <div className="flex flex-col">
          <p className="flex items-start gap-1">
            <span
              className={cn("flex h-6 flex-none items-center text-[20px]", {
                "text-pink-500": animal.gender === Gender.FEMALE,
                "text-brandBlue": animal.gender === Gender.MALE,
              })}
              title={GENDER_TRANSLATION[animal.gender]}
            >
              <Icon id={animal.gender === Gender.FEMALE ? "venus" : "mars"} />
            </span>

            <span
              className={cn(
                "flex-1 transition-colors duration-100 ease-in-out text-title-item",
                {
                  "group-hover:text-brandBlue":
                    !isDisabled && animal.gender === Gender.MALE,
                  "group-hover:text-pink-500":
                    !isDisabled && animal.gender === Gender.FEMALE,
                },
              )}
            >
              {animal.name}
            </span>
          </p>

          <p className="flex items-start gap-6 text-gray-500 text-caption-default">
            <span className="flex-1">{speciesLabels}</span>
            <span className="flex-none">{formatAge(animal.birthdate)}</span>
          </p>
        </div>
      </BaseLink>
    </li>
  );
}
