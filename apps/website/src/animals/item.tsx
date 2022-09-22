import { formatAge } from "@animeaux/shared";
import { Gender, Species } from "@prisma/client";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { isDefined } from "~/core/isDefined";
import { toSlug } from "~/core/slugs";
import { GENDER_TRANSLATION, SPECIES_TRANSLATION } from "~/core/translations";
import { DynamicImage } from "~/dataDisplay/image";
import { Icon } from "~/generated/icon";

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
        to={`/animal/${toSlug(animal.name)}-${animal.id}`}
        disabled={isDisabled}
        className="group w-full rounded-bubble-md flex flex-col gap-3"
      >
        <DynamicImage
          imageId={animal.avatar}
          alt={animal.name}
          sizes={{ lg: "300px", sm: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="w-full aspect-4/3 flex-none rounded-bubble-md"
        />

        <div className="flex flex-col">
          <p className="flex items-start gap-1">
            <span
              className={cn("h-6 flex-none flex items-center text-[20px]", {
                "text-pink-500": animal.gender === Gender.FEMALE,
                "text-brandBlue": animal.gender === Gender.MALE,
              })}
              title={GENDER_TRANSLATION[animal.gender]}
            >
              <Icon id={animal.gender === Gender.FEMALE ? "venus" : "mars"} />
            </span>

            <span
              className={cn(
                "flex-1 text-title-item transition-colors duration-100 ease-in-out",
                {
                  "group-hover:text-brandBlue":
                    !isDisabled && animal.gender === Gender.MALE,
                  "group-hover:text-pink-500":
                    !isDisabled && animal.gender === Gender.FEMALE,
                }
              )}
            >
              {animal.name}
            </span>
          </p>

          <p className="flex items-start gap-6 text-caption-default text-gray-500">
            <span className="flex-1">{speciesLabels}</span>
            <span className="flex-none">{formatAge(animal.birthdate)}</span>
          </p>
        </div>
      </BaseLink>
    </li>
  );
}
