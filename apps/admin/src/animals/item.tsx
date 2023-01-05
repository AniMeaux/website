import { Animal, Gender, User } from "@prisma/client";
import { GENDER_ICON, GENDER_TRANSLATION } from "~/animals/gender";
import { getAnimalDisplayName } from "~/animals/profile/name";
import { StatusBadge } from "~/animals/status";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { DynamicImage, DynamicImageProps } from "~/core/dataDisplay/image";
import { Icon } from "~/generated/icon";

export function AnimalItem({
  animal,
  imageSizes,
  imageLoading,
  className,
}: {
  animal: Pick<
    Animal,
    "id" | "name" | "alias" | "gender" | "avatar" | "status"
  > & {
    manager?: Pick<User, "displayName"> | null;
  };
  imageSizes: DynamicImageProps["sizes"];
  imageLoading?: DynamicImageProps["loading"];
  className?: string;
}) {
  return (
    <BaseLink
      to={`/animals/${animal.id}`}
      className={cn(className, "group flex flex-col gap-0.5")}
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

        <StatusBadge
          status={animal.status}
          className="absolute bottom-0.5 right-0.5"
        />
      </span>

      <div className="flex flex-col">
        <p className="flex items-start gap-0.5">
          <span
            className={cn("h-2 flex-none flex items-center", {
              "text-pink-500": animal.gender === Gender.FEMALE,
              "text-blue-500": animal.gender === Gender.MALE,
            })}
            title={GENDER_TRANSLATION[animal.gender]}
          >
            <Icon id={GENDER_ICON[animal.gender]} />
          </span>

          <span
            className={cn(
              "flex-1 text-body-emphasis transition-colors duration-100 ease-in-out",
              {
                "group-hover:text-blue-500": animal.gender === Gender.MALE,
                "group-hover:text-pink-500": animal.gender === Gender.FEMALE,
              }
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
