import {
  OperationPaginationParams,
  OperationPaginationResult,
} from "./operationPagination";

export enum EventCategory {
  COLLECTION = "COLLECTION",
  SHOW = "SHOW",
  FORUM = "FORUM",
  SENSITIZATION = "SENSITIZATION",
  BIRTHDAY = "BIRTHDAY",
  ATHLETIC = "ATHLETIC",
}

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  [EventCategory.ATHLETIC]: "Sportif",
  [EventCategory.BIRTHDAY]: "Anniversaire",
  [EventCategory.COLLECTION]: "Collecte",
  [EventCategory.FORUM]: "Forum",
  [EventCategory.SENSITIZATION]: "Sensibilisation",
  [EventCategory.SHOW]: "Salon",
};

export type Event = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image?: string;
  startDate: string;
  endDate: string;
  isFullDay: boolean;
  location: string;
  category: EventCategory;
  isVisible: boolean;
};

export type EventOperations = {
  getAllEvents: (
    params: OperationPaginationParams
  ) => OperationPaginationResult<Event>;
  getVisibleUpCommingEvents: () => Event[];
  getVisiblePastEvents: (
    params: OperationPaginationParams
  ) => OperationPaginationResult<Event>;
  getEvent: (params: { id: string }) => Event;
  createEvent: (params: {
    title: string;
    shortDescription: string;
    description: string;
    image: string | null;
    startDate: string;
    endDate: string;
    isFullDay: boolean;
    location: string;
    category: EventCategory;
    isVisible: boolean;
  }) => Event;
  updateEvent: (params: {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    image: string | null;
    startDate: string;
    endDate: string;
    isFullDay: boolean;
    location: string;
    category: EventCategory;
    isVisible: boolean;
  }) => Event;
  deleteEvent: (params: { id: string }) => boolean;
};
