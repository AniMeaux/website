import { Status } from "@prisma/client";

export const ACTIVE_ANIMAL_STATUS: Status[] = [
  Status.OPEN_TO_ADOPTION,
  Status.OPEN_TO_RESERVATION,
  Status.RESERVED,
  Status.RETIRED,
  Status.UNAVAILABLE,
];

export const NON_ACTIVE_ANIMAL_STATUS: Status[] = Object.values(Status).filter(
  (status) => !ACTIVE_ANIMAL_STATUS.includes(status)
);
