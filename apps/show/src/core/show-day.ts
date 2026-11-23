import { DateTime } from "luxon"

export namespace ShowDay {
  export type Enum = (typeof Enum)[keyof typeof Enum]
  export const Enum = {
    SATURDAY: "samedi",
    SUNDAY: "dimanche",
  } as const

  export const values = [Enum.SATURDAY, Enum.SUNDAY]

  export const schedules: Record<Enum, { start: DateTime; end: DateTime }> = {
    [Enum.SATURDAY]: {
      start: DateTime.fromISO("2027-06-12T10:00:00.000+02:00"),
      end: DateTime.fromISO("2027-06-12T18:00:00.000+02:00"),
    },

    [Enum.SUNDAY]: {
      start: DateTime.fromISO("2027-06-13T10:00:00.000+02:00"),
      end: DateTime.fromISO("2027-06-13T18:00:00.000+02:00"),
    },
  }

  export const intervals: Record<Enum, DateTime[]> = {
    [Enum.SATURDAY]: [
      DateTime.fromISO("2027-06-12T10:00:00.000+02:00"),
      DateTime.fromISO("2027-06-12T11:00:00.000+02:00"),
      DateTime.fromISO("2027-06-12T12:00:00.000+02:00"),
      DateTime.fromISO("2027-06-12T13:00:00.000+02:00"),
      DateTime.fromISO("2027-06-12T14:00:00.000+02:00"),
      DateTime.fromISO("2027-06-12T15:00:00.000+02:00"),
      DateTime.fromISO("2027-06-12T16:00:00.000+02:00"),
      DateTime.fromISO("2027-06-12T17:00:00.000+02:00"),
      DateTime.fromISO("2027-06-12T18:00:00.000+02:00"),
    ],
    [Enum.SUNDAY]: [
      DateTime.fromISO("2027-06-13T10:00:00.000+02:00"),
      DateTime.fromISO("2027-06-13T11:00:00.000+02:00"),
      DateTime.fromISO("2027-06-13T12:00:00.000+02:00"),
      DateTime.fromISO("2027-06-13T13:00:00.000+02:00"),
      DateTime.fromISO("2027-06-13T14:00:00.000+02:00"),
      DateTime.fromISO("2027-06-13T15:00:00.000+02:00"),
      DateTime.fromISO("2027-06-13T16:00:00.000+02:00"),
      DateTime.fromISO("2027-06-13T17:00:00.000+02:00"),
      DateTime.fromISO("2027-06-13T18:00:00.000+02:00"),
    ],
  }

  export const openingTime = schedules[Enum.SATURDAY].start
  export const closingTime = schedules[Enum.SUNDAY].end

  export function hasShowEnded() {
    return DateTime.now() >= closingTime
  }
}
