import isEqual from "lodash.isequal";
import orderBy from "lodash.orderby";
import { z } from "zod";
import { parseOrDefault } from "~/core/schemas";

export class FosterFamilySearchParams extends URLSearchParams {
  static readonly Keys = {
    NAME: "q",
    ZIP_CODE: "zip",
    CITY: "city",
  };

  isEmpty() {
    return this.areFiltersEqual(new FosterFamilySearchParams());
  }

  areFiltersEqual(other: FosterFamilySearchParams) {
    return (
      isEqual(this.getName(), other.getName()) &&
      isEqual(this.getZipCode(), other.getZipCode()) &&
      isEqual(orderBy(this.getCities()), orderBy(other.getCities()))
    );
  }

  getName() {
    return this.get(FosterFamilySearchParams.Keys.NAME)?.trim() || null;
  }

  setName(name: string) {
    const copy = new FosterFamilySearchParams(this);

    name = name.trim();
    if (name !== "") {
      copy.set(FosterFamilySearchParams.Keys.NAME, name);
    } else if (copy.has(FosterFamilySearchParams.Keys.NAME)) {
      copy.delete(FosterFamilySearchParams.Keys.NAME);
    }

    return copy;
  }

  deleteName() {
    const copy = new FosterFamilySearchParams(this);
    copy.delete(FosterFamilySearchParams.Keys.NAME);
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
