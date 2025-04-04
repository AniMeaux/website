import { DateTime } from "luxon";

export namespace ShowDay {
  export type Enum = (typeof Enum)[keyof typeof Enum];
  export const Enum = {
    SATURDAY: "samedi",
    SUNDAY: "dimanche",
  } as const;

  export const values = [Enum.SATURDAY, Enum.SUNDAY];

  export const schedules: Record<Enum, { start: DateTime; end: DateTime }> = {
    [Enum.SATURDAY]: {
      start: DateTime.fromISO("2025-06-07T10:00:00.000+02:00"),
      end: DateTime.fromISO("2025-06-07T18:00:00.000+02:00"),
    },

    [Enum.SUNDAY]: {
      start: DateTime.fromISO("2025-06-08T10:00:00.000+02:00"),
      end: DateTime.fromISO("2025-06-08T18:00:00.000+02:00"),
    },
  };

  export const intervals: Record<Enum, DateTime[]> = {
    [Enum.SATURDAY]: [
      DateTime.fromISO("2025-06-07T10:00:00.000+02:00"),
      DateTime.fromISO("2025-06-07T11:00:00.000+02:00"),
      DateTime.fromISO("2025-06-07T12:00:00.000+02:00"),
      DateTime.fromISO("2025-06-07T13:00:00.000+02:00"),
      DateTime.fromISO("2025-06-07T14:00:00.000+02:00"),
      DateTime.fromISO("2025-06-07T15:00:00.000+02:00"),
      DateTime.fromISO("2025-06-07T16:00:00.000+02:00"),
      DateTime.fromISO("2025-06-07T17:00:00.000+02:00"),
      DateTime.fromISO("2025-06-07T18:00:00.000+02:00"),
    ],
    [Enum.SUNDAY]: [
      DateTime.fromISO("2025-06-08T10:00:00.000+02:00"),
      DateTime.fromISO("2025-06-08T11:00:00.000+02:00"),
      DateTime.fromISO("2025-06-08T12:00:00.000+02:00"),
      DateTime.fromISO("2025-06-08T13:00:00.000+02:00"),
      DateTime.fromISO("2025-06-08T14:00:00.000+02:00"),
      DateTime.fromISO("2025-06-08T15:00:00.000+02:00"),
      DateTime.fromISO("2025-06-08T16:00:00.000+02:00"),
      DateTime.fromISO("2025-06-08T17:00:00.000+02:00"),
      DateTime.fromISO("2025-06-08T18:00:00.000+02:00"),
    ],
  };

  export const openingTime = schedules[Enum.SATURDAY].start;
  export const closingTime = schedules[Enum.SUNDAY].end;

  export function hasShowEnded() {
    return DateTime.now() >= closingTime;
  }
}
