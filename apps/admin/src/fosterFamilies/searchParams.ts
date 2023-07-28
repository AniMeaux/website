import { Species } from "@prisma/client";
import isEqual from "lodash.isequal";
import orderBy from "lodash.orderby";
import { z } from "zod";
import { parseOrDefault } from "~/core/schemas";

export class FosterFamilySearchParams extends URLSearchParams {
  static readonly Keys = {
    DISPLAY_NAME: "q",
    CITY: "city",
    SORT: "sort",
    SPECIES_ALREADY_PRESENT: "present",
    SPECIES_TO_AVOID: "avoid",
    SPECIES_TO_HOST: "host",
    ZIP_CODE: "zip",
  };

  isEmpty() {
    return this.areFiltersEqual(new FosterFamilySearchParams());
  }

  areFiltersEqual(other: FosterFamilySearchParams) {
    return (
      isEqual(orderBy(this.getCities()), orderBy(other.getCities())) &&
      isEqual(this.getDisplayName(), other.getDisplayName()) &&
      isEqual(
        orderBy(this.getSpeciesAlreadyPresent()),
        orderBy(other.getSpeciesAlreadyPresent())
      ) &&
      isEqual(
        orderBy(this.getSpeciesToAvoid()),
        orderBy(other.getSpeciesToAvoid())
      ) &&
      isEqual(this.getSpeciesToHost(), other.getSpeciesToHost()) &&
      isEqual(this.getZipCode(), other.getZipCode())
    );
  }

  getDisplayName() {
    return (
      this.get(FosterFamilySearchParams.Keys.DISPLAY_NAME)?.trim() || undefined
    );
  }

  setDisplayName(displayName: string) {
    const copy = new FosterFamilySearchParams(this);

    displayName = displayName.trim();
    if (displayName !== "") {
      copy.set(FosterFamilySearchParams.Keys.DISPLAY_NAME, displayName);
    } else if (copy.has(FosterFamilySearchParams.Keys.DISPLAY_NAME)) {
      copy.delete(FosterFamilySearchParams.Keys.DISPLAY_NAME);
    }

    return copy;
  }

  deleteDisplayName() {
    const copy = new FosterFamilySearchParams(this);
    copy.delete(FosterFamilySearchParams.Keys.DISPLAY_NAME);
    return copy;
  }

  getCities() {
    return parseOrDefault(
      z.string().array().default([]),
      this.getAll(FosterFamilySearchParams.Keys.CITY)
    );
  }

  getSpeciesAlreadyPresent() {
    return parseOrDefault(
      z.nativeEnum(Species).array().default([]),
      this.getAll(FosterFamilySearchParams.Keys.SPECIES_ALREADY_PRESENT)
    );
  }

  getSpeciesToAvoid() {
    return parseOrDefault(
      z.nativeEnum(Species).array().default([]),
      this.getAll(FosterFamilySearchParams.Keys.SPECIES_TO_AVOID)
    );
  }

  getSpeciesToHost() {
    return parseOrDefault(
      z.nativeEnum(Species).optional(),
      this.get(FosterFamilySearchParams.Keys.SPECIES_TO_HOST)
    );
  }

  getZipCode() {
    return (
      parseOrDefault(
        z.string().regex(/^\d*$/).default(""),
        this.get(FosterFamilySearchParams.Keys.ZIP_CODE)
      ) || null
    );
  }

  deleteZipCode() {
    const copy = new FosterFamilySearchParams(this);
    copy.delete(FosterFamilySearchParams.Keys.ZIP_CODE);
    return copy;
  }
}
