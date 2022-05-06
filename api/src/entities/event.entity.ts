import { EventCategory } from "@animeaux/shared";

export const EVENT_COLLECTION = "events";

export type EventFromStore = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image?: string | null;
  startDate: string;
  startDateTimestamp: number;
  endDate: string;
  endDateTimestamp: number;
  isFullDay: boolean;
  location: string;
  category: EventCategory;
  isVisible: boolean;
};
