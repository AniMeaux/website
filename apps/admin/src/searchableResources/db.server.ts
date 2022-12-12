import {
  Animal,
  Breed,
  Color,
  Event,
  FosterFamily,
  User,
} from "@prisma/client";
import invariant from "tiny-invariant";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import { visit } from "~/core/visitor";
import {
  SearchableAnimalHit,
  SearchableEventHit,
  SearchableFosterFamilyHit,
  SearchableResourceHit,
  SearchableUserHit,
} from "~/searchableResources/algolia.server";
import { SearchableResourceSearchParams } from "~/searchableResources/searchParams";
import { SearchableResourceType } from "~/searchableResources/type";

const SEARCH_COUNT = 6;

type SearchableAnimal = SearchableAnimalHit & {
  data: Pick<Animal, "avatar" | "id" | "species"> & {
    breed: null | Pick<Breed, "name">;
    color: null | Pick<Color, "name">;
  };
};
type SearchableEvent = SearchableEventHit & {
  data: Pick<Event, "endDate" | "id" | "isFullDay" | "startDate">;
};
type SearchableFosterFamily = SearchableFosterFamilyHit & {
  data: Pick<FosterFamily, "city" | "id" | "zipCode">;
};
type SearchableUser = SearchableUserHit & { data: Pick<User, "email" | "id"> };

type SearchableResource =
  | SearchableAnimal
  | SearchableEvent
  | SearchableFosterFamily
  | SearchableUser;

export async function searchResources(
  searchParams: SearchableResourceSearchParams,
  fallbackTypes: SearchableResourceType[]
) {
  const text = searchParams.getText();
  if (text == null) {
    return [];
  }

  if (fallbackTypes.length === Object.values(SearchableResourceType).length) {
    fallbackTypes = [];
  }

  const hits = await algolia.searchableResource.search(
    text,
    { type: searchParams.getType() ?? fallbackTypes },
    { hitsPerPage: SEARCH_COUNT }
  );

  const animalsId: string[] = [];
  const eventsId: string[] = [];
  const fosterFamiliesId: string[] = [];
  const usersId: string[] = [];

  hits.forEach((hit) => {
    const idArray = visit(hit, {
      [SearchableResourceType.ANIMAL]: () => animalsId,
      [SearchableResourceType.EVENT]: () => eventsId,
      [SearchableResourceType.FOSTER_FAMILY]: () => fosterFamiliesId,
      [SearchableResourceType.USER]: () => usersId,
    });

    idArray.push(hit.id);
  });

  const [animals, events, fosterFamilies, users] = await Promise.all([
    animalsId.length === 0
      ? Promise.resolve([])
      : prisma.animal.findMany({
          where: { id: { in: animalsId } },
          select: {
            avatar: true,
            id: true,
            species: true,
            breed: { select: { name: true } },
            color: { select: { name: true } },
          },
        }),
    eventsId.length === 0
      ? Promise.resolve([])
      : prisma.event.findMany({
          where: { id: { in: eventsId } },
          select: { endDate: true, id: true, isFullDay: true, startDate: true },
        }),
    fosterFamiliesId.length === 0
      ? Promise.resolve([])
      : prisma.fosterFamily.findMany({
          where: { id: { in: fosterFamiliesId } },
          select: { city: true, id: true, zipCode: true },
        }),
    usersId.length === 0
      ? Promise.resolve([])
      : prisma.user.findMany({
          where: { id: { in: usersId } },
          select: { email: true, id: true },
        }),
  ]);

  return hits.map((hit) => {
    return visit<
      SearchableResourceType,
      SearchableResourceHit,
      SearchableResource
    >(hit, {
      [SearchableResourceType.ANIMAL]: (hit) => {
        const animal = animals.find((animal) => animal.id === hit.id);
        invariant(animal != null, "Animal from algolia should exists.");
        return { ...hit, data: { ...hit.data, ...animal } };
      },

      [SearchableResourceType.EVENT]: (hit) => {
        const event = events.find((event) => event.id === hit.id);
        invariant(event != null, "Event from algolia should exists.");
        return { ...hit, data: { ...hit.data, ...event } };
      },

      [SearchableResourceType.FOSTER_FAMILY]: (hit) => {
        const fosterFamily = fosterFamilies.find(
          (fosterFamily) => fosterFamily.id === hit.id
        );
        invariant(
          fosterFamily != null,
          "Foster family from algolia should exists."
        );
        return { ...hit, data: { ...hit.data, ...fosterFamily } };
      },

      [SearchableResourceType.USER]: (hit) => {
        const user = users.find((user) => user.id === hit.id);
        invariant(user != null, "User from algolia should exists.");
        return { ...hit, data: { ...hit.data, ...user } };
      },
    });
  });
}
