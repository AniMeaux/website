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

  export const openingTime = schedules[Enum.SATURDAY].start;
  export const closingTime = schedules[Enum.SUNDAY].end;

  export function hasShowEnded() {
    return DateTime.now() >= closingTime;
  }
}
