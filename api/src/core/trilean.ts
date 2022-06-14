import { Trilean } from "@animeaux/shared";

export function trileanToBoolean(trilean: Trilean): boolean | null {
  if (trilean === Trilean.UNKNOWN) {
    return null;
  }

  return trilean === Trilean.TRUE;
}

export function booleanToTrilean(value: boolean | null): Trilean {
  if (value == null) {
    return Trilean.UNKNOWN;
  }

  return value ? Trilean.TRUE : Trilean.FALSE;
}
