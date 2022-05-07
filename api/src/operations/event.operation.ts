import {
  Event,
  EventCategory,
  EventOperations,
  UserGroup,
} from "@animeaux/shared";
import { getFirestore } from "firebase-admin/firestore";
import { v4 as uuid } from "uuid";
import { boolean, mixed, number, object, string } from "yup";
import {
  AlgoliaClient,
  createSearchFilters,
  DEFAULT_SEARCH_OPTIONS,
} from "../core/algolia";
import { assertUserHasGroups, userHasGroups } from "../core/authentication";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";
import { EventFromStore, EVENT_COLLECTION } from "../entities/event.entity";

const EventIndex = AlgoliaClient.initIndex(EVENT_COLLECTION);

export const eventOperations: OperationsImpl<EventOperations> = {
  async getAllEvents(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"getAllEvents">(
      object({ page: number().min(0) }),
      rawParams
    );

    const result = await EventIndex.search<EventFromStore>("", {
      ...DEFAULT_SEARCH_OPTIONS,
      page: params.page ?? 0,
    });

    const hits = result.hits.map<Event>((hit) => ({
      id: hit.id,
      title: hit.title,
      shortDescription: hit.shortDescription,
      description: hit.description,
      image: hit.image ?? undefined,
      startDate: hit.startDate,
      endDate: hit.endDate,
      isFullDay: hit.isFullDay,
      location: hit.location,
      category: hit.category,
      isVisible: hit.isVisible,
    }));

    return {
      hits,
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
    };
  },

  async getVisibleUpCommingEvents() {
    const snapshots = await getFirestore()
      .collection(EVENT_COLLECTION)
      .where("isVisible", "==", true)
      .where("endDateTimestamp", ">=", Date.now())
      .orderBy("endDateTimestamp")
      .get();

    return snapshots.docs.map<Event>((doc) => {
      const event = doc.data() as EventFromStore;

      return {
        id: event.id,
        title: event.title,
        shortDescription: event.shortDescription,
        description: event.description,
        image: event.image ?? undefined,
        startDate: event.startDate,
        endDate: event.endDate,
        isFullDay: event.isFullDay,
        location: event.location,
        category: event.category,
        isVisible: event.isVisible,
      };
    });
  },

  async getVisiblePastEvents(rawParams) {
    const params = validateParams<"getVisiblePastEvents">(
      object({ page: number().min(0) }),
      rawParams
    );

    const result = await EventIndex.search<EventFromStore>("", {
      ...DEFAULT_SEARCH_OPTIONS,
      page: params.page ?? 0,

      // Multiple of 2 and 3 to be nicely displayed.
      hitsPerPage: 18,

      filters: createSearchFilters({
        isVisible: true,
        endDateTimestamp: `0 TO ${Date.now()}`,
      }),
    });

    const hits = result.hits.map<Event>((hit) => ({
      id: hit.id,
      title: hit.title,
      shortDescription: hit.shortDescription,
      description: hit.description,
      image: hit.image ?? undefined,
      startDate: hit.startDate,
      endDate: hit.endDate,
      isFullDay: hit.isFullDay,
      location: hit.location,
      category: hit.category,
      isVisible: hit.isVisible,
    }));

    return {
      hits,
      hitsTotalCount: result.nbHits,
      page: result.page,
      pageCount: result.nbPages,
    };
  },

  async getEvent(rawParams, context) {
    const allowHidden = userHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"getEvent">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const event = await getEventFromStore(params.id);

    if (!allowHidden && !event.isVisible) {
      throw new OperationError(404);
    }

    return {
      id: event.id,
      title: event.title,
      shortDescription: event.shortDescription,
      description: event.description,
      image: event.image ?? undefined,
      startDate: event.startDate,
      endDate: event.endDate,
      isFullDay: event.isFullDay,
      location: event.location,
      category: event.category,
      isVisible: event.isVisible,
    };
  },

  async createEvent(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"createEvent">(
      object({
        title: string().trim().required(),
        shortDescription: string().trim().required(),
        description: string().trim().required(),
        image: string().nullable().defined(),
        startDate: string().dateISO().required(),
        endDate: string().dateISO().required(),
        isFullDay: boolean().required(),
        location: string().trim().required(),
        category: mixed().oneOf(Object.values(EventCategory)).required(),
        isVisible: boolean().required(),
      }),
      rawParams
    );

    const event = addTimestamps({ id: uuid(), ...params });

    assertIsValid(event);

    await getFirestore().collection(EVENT_COLLECTION).doc(event.id).set(event);

    await EventIndex.saveObject({
      ...event,
      objectID: event.id,
    });

    return {
      id: event.id,
      title: event.title,
      shortDescription: event.shortDescription,
      description: event.description,
      image: event.image ?? undefined,
      startDate: event.startDate,
      endDate: event.endDate,
      isFullDay: event.isFullDay,
      location: event.location,
      category: event.category,
      isVisible: event.isVisible,
    };
  },

  async updateEvent(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"updateEvent">(
      object({
        id: string().uuid().required(),
        title: string().trim().required(),
        shortDescription: string().trim().required(),
        description: string().trim().required(),
        image: string().nullable().defined(),
        startDate: string().dateISO().required(),
        endDate: string().dateISO().required(),
        isFullDay: boolean().required(),
        location: string().trim().required(),
        category: mixed().oneOf(Object.values(EventCategory)).required(),
        isVisible: boolean().required(),
      }),
      rawParams
    );

    const currentEvent = await getEventFromStore(params.id);
    const newEvent = addTimestamps({ ...currentEvent, ...params });

    assertIsValid(newEvent);

    await getFirestore()
      .collection(EVENT_COLLECTION)
      .doc(newEvent.id)
      .update(newEvent);

    await EventIndex.partialUpdateObject({
      ...newEvent,
      objectID: newEvent.id,
    });

    return {
      id: newEvent.id,
      title: newEvent.title,
      shortDescription: newEvent.shortDescription,
      description: newEvent.description,
      image: newEvent.image ?? undefined,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
      isFullDay: newEvent.isFullDay,
      location: newEvent.location,
      category: newEvent.category,
      isVisible: newEvent.isVisible,
    };
  },

  async deleteEvent(rawParams, context) {
    assertUserHasGroups(context.currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"deleteEvent">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    await getFirestore().collection(EVENT_COLLECTION).doc(params.id).delete();

    await EventIndex.deleteObject(params.id);
    return true;
  },
};

function assertIsValid(event: EventFromStore) {
  if (event.startDateTimestamp >= event.endDateTimestamp) {
    throw new OperationError(400);
  }
}

function addTimestamps(
  event: Omit<EventFromStore, "startDateTimestamp" | "endDateTimestamp">
): EventFromStore {
  return {
    ...event,
    startDateTimestamp: new Date(event.startDate).getTime(),
    endDateTimestamp: new Date(event.endDate).getTime(),
  };
}

async function getEventFromStore(id: string) {
  const snapshot = await getFirestore()
    .collection(EVENT_COLLECTION)
    .doc(id)
    .get();

  if (!snapshot.exists) {
    throw new OperationError(404);
  }

  return snapshot.data() as EventFromStore;
}
