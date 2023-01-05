import isEqual from "lodash.isequal";
import orderBy from "lodash.orderby";
import { z } from "zod";
import { parseOrDefault } from "~/core/schemas";

export class FosterFamilySearchParams extends URLSearchParams {
  static readonly Keys = {
    DISPLAY_NAME: "q",
    ZIP_CODE: "zip",
    CITY: "city",
  };

  isEmpty() {
    return this.areFiltersEqual(new FosterFamilySearchParams());
  }

  areFiltersEqual(other: FosterFamilySearchParams) {
    return (
      isEqual(this.getDisplayName(), other.getDisplayName()) &&
      isEqual(this.getZipCode(), other.getZipCode()) &&
      isEqual(orderBy(this.getCities()), orderBy(other.getCities()))
    );
  }

  getDisplayName() {
    return this.get(FosterFamilySearchParams.Keys.DISPLAY_NAME)?.trim() || null;
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

  getCities() {
    return parseOrDefault(
      z.string().array().default([]),
      this.getAll(FosterFamilySearchParams.Keys.CITY)
    );
  }
}
