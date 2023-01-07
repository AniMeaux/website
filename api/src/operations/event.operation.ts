import {
  Event as PublicEvent,
  EventCategory,
  EventOperations,
  UserGroup,
} from "@animeaux/shared";
import { Event, Prisma } from "@prisma/client";
import { DateTime } from "luxon";
import { boolean, mixed, number, object, string } from "yup";
import {
  assertUserHasGroups,
  getCurrentUser,
  userHasGroups,
} from "../core/authentication";
import { prisma } from "../core/db";
import { OperationError, OperationsImpl } from "../core/operations";
import { validateParams } from "../core/validation";

// Multiple of 2 and 3 to be nicely displayed.
const EVENT_COUNT_PER_PAGE = 18;

export const eventOperations: OperationsImpl<EventOperations> = {
  async getAllEvents(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"getAllEvents">(
      object({ page: number().min(0) }),
      rawParams
    );

    const page = params.page ?? 0;

    const [count, events] = await Promise.all([
      prisma.event.count(),
      prisma.event.findMany({
        skip: page * EVENT_COUNT_PER_PAGE,
        take: EVENT_COUNT_PER_PAGE,
        orderBy: { startDate: "desc" },
      }),
    ]);

    return {
      hitsTotalCount: count,
      page,
      pageCount: Math.ceil(count / EVENT_COUNT_PER_PAGE),
      hits: events.map(mapToPublicEvent),
    };
  },

  async getVisibleUpCommingEvents() {
    const events = await prisma.event.findMany({
      where: { isVisible: true, endDate: { gte: new Date() } },
      orderBy: { endDate: "asc" },
    });

    return events.map(mapToPublicEvent);
  },

  async getVisiblePastEvents(rawParams) {
    const params = validateParams<"getVisiblePastEvents">(
      object({ page: number().min(0) }),
      rawParams
    );

    const page = params.page ?? 0;

    const where: Prisma.EventWhereInput = {
      isVisible: true,
      endDate: { lt: new Date() },
    };

    const [count, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        skip: page * EVENT_COUNT_PER_PAGE,
        take: EVENT_COUNT_PER_PAGE,
        orderBy: { endDate: "desc" },
      }),
    ]);

    return {
      hitsTotalCount: count,
      page,
      pageCount: Math.ceil(count / EVENT_COUNT_PER_PAGE),
      hits: events.map(mapToPublicEvent),
    };
  },

  async getEvent(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    const allowHidden = userHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"getEvent">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });

    if (event == null || (!allowHidden && !event.isVisible)) {
      throw new OperationError(404);
    }

    return mapToPublicEvent(event);
  },

  async createEvent(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"createEvent">(
      object({
        title: string().trim().required(),
        url: string().trim().nullable().defined(),
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

    if (
      DateTime.fromISO(params.startDate) >= DateTime.fromISO(params.endDate)
    ) {
      throw new OperationError(400);
    }

    if (params.isVisible && params.url == null) {
      throw new OperationError(400);
    }

    const event = await prisma.event.create({
      data: {
        title: params.title,
        url: params.url,
        description: params.description,
        image: params.image,
        startDate: params.startDate,
        endDate: params.endDate,
        isFullDay: params.isFullDay,
        location: params.location,
        category: params.category,
        isVisible: params.isVisible,
      },
    });

    return mapToPublicEvent(event);
  },

  async updateEvent(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"updateEvent">(
      object({
        id: string().uuid().required(),
        title: string().trim().required(),
        url: string().trim().nullable().defined(),
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

    const where: Prisma.EventWhereUniqueInput = { id: params.id };

    if ((await prisma.event.count({ where })) === 0) {
      throw new OperationError(404);
    }

    if (params.isVisible && params.url == null) {
      throw new OperationError(400);
    }

    const event = await prisma.event.update({
      where,
      data: {
        title: params.title,
        url: params.url,
        description: params.description,
        image: params.image,
        startDate: params.startDate,
        endDate: params.endDate,
        isFullDay: params.isFullDay,
        location: params.location,
        category: params.category,
        isVisible: params.isVisible,
      },
    });

    return mapToPublicEvent(event);
  },

  async deleteEvent(rawParams, context) {
    const currentUser = await getCurrentUser(context);
    assertUserHasGroups(currentUser, [UserGroup.ADMIN]);

    const params = validateParams<"deleteEvent">(
      object({ id: string().uuid().required() }),
      rawParams
    );

    const where: Prisma.EventWhereUniqueInput = { id: params.id };

    if ((await prisma.event.count({ where })) === 0) {
      throw new OperationError(404);
    }

    await prisma.event.delete({ where });

    return true;
  },
};

function mapToPublicEvent(event: Event): PublicEvent {
  return {
    id: event.id,
    title: event.title,
    url: event.url || undefined,
    description: event.description,
    image: event.image ?? undefined,
    startDate: DateTime.fromJSDate(event.startDate).toISO(),
    endDate: DateTime.fromJSDate(event.endDate).toISO(),
    isFullDay: event.isFullDay,
    location: event.location,
    category: event.category,
    isVisible: event.isVisible,
  };
}
