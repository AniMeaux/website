import { Status } from "@prisma/client";

export const ADOPTABLE_ANIMAL_STATUS: Status[] = [
  Status.OPEN_TO_ADOPTION,
  Status.OPEN_TO_RESERVATION,
];

export const SAVED_ANIMAL_STATUS: Status[] = [Status.ADOPTED, Status.FREE];
