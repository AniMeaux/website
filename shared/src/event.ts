import {
  OperationPaginationParams,
  OperationPaginationResult,
} from "./operationPagination";

export type Event = {
  id: string;
  title: string;
  url?: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  isFullDay: boolean;
  location: string;
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
    url: string | null;
    description: string;
    image: string;
    startDate: string;
    endDate: string;
    isFullDay: boolean;
    location: string;
    isVisible: boolean;
  }) => Event;
  updateEvent: (params: {
    id: string;
    title: string;
    url: string | null;
    description: string;
    image: string;
    startDate: string;
    endDate: string;
    isFullDay: boolean;
    location: string;
    isVisible: boolean;
  }) => Event;
  deleteEvent: (params: { id: string }) => boolean;
};
