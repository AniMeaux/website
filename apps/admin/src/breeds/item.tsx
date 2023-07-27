import { Breed, Prisma } from "@prisma/client";
import { SPECIES_ICON } from "~/animals/species";
import { Action } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Icon } from "~/generated/icon";

export function BreedItem({
  breed,
  className,
}: {
  breed: Pick<Breed, "id" | "name" | "species"> & {
    _count: Pick<Prisma.BreedCountOutputType, "animals">;
  };
  className?: string;
}) {
  return (
    <span
      className={cn(
        className,
        "py-1 grid grid-cols-[auto_minmax(0px,1fr)] grid-flow-col items-start gap-1 md:gap-2"
      )}
    >
      <Icon
        id={SPECIES_ICON[breed.species]}
        className="text-[20px] text-gray-600"
      />

      <span className="flex flex-col md:flex-row md:gap-2">
        <span className="text-body-emphasis">{breed.name}</span>

        <span className="text-gray-500">
          {breed._count.animals}{" "}
          {breed._count.animals > 1 ? "animaux" : "animal"}
        </span>
      </span>

      <span className="h-2 flex items-center gap-0.5">
        <Action asChild variant="text" color="gray" isIconOnly title="Modifier">
          <BaseLink to={`./${breed.id}/edit`}>
            <Icon id="pen" />
          </BaseLink>
        </Action>

        <Action
          variant="text"
          color="red"
          isIconOnly
          title={
            breed._count.animals > 0
              ? "La race ne peut être supprimée tant que des animaux sont de cette race."
              : "Supprimer"
          }
          disabled={breed._count.animals > 0}
        >
          <Icon id="trash" />
        </Action>
      </span>
    </span>
  );
}
