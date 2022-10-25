import { AnimalAge } from "@animeaux/shared";
import { Species, Status } from "@prisma/client";
import isEqual from "lodash.isequal";
import orderBy from "lodash.orderby";
import { DateTime } from "luxon";
import { z } from "zod";
import { parseOrDefault } from "~/core/schemas";

enum Sort {
  PICK_UP = "PICK_UP",
  NAME = "NAME",
}

enum Keys {
  SORT = "sort",
  NAME_OR_ALIAS = "q",
  SPECIES = "species",
  AGE = "age",
  STATUS = "status",
  MANAGERS_ID = "manager",
  MIN_PICK_UP_DATE = "min",
  MAX_PICK_UP_DATE = "max",
}

export class AnimalSearchParams extends URLSearchParams {
  static readonly Sort = Sort;
  static readonly Keys = Keys;

  isEmpty() {
    return this.areFiltersEqual(new AnimalSearchParams());
  }

  areFiltersEqual(other: AnimalSearchParams) {
    return (
      isEqual(orderBy(this.getSpecies()), orderBy(other.getSpecies())) &&
      isEqual(this.getNameOrAlias(), other.getNameOrAlias()) &&
      isEqual(orderBy(this.getStatuses()), orderBy(other.getStatuses())) &&
      isEqual(orderBy(this.getManagersId()), orderBy(other.getManagersId())) &&
      isEqual(this.getMinPickUpDate(), other.getMinPickUpDate()) &&
      isEqual(this.getMaxPickUpDate(), other.getMaxPickUpDate())
    );
  }

  getSort() {
    return parseOrDefault(
      z.nativeEnum(Sort).default(Sort.PICK_UP),
      this.get(Keys.SORT)
    );
  }

  getNameOrAlias() {
    return this.get(Keys.NAME_OR_ALIAS) || null;
  }

  deleteNameOrAlias() {
    const copy = new AnimalSearchParams(this);
    copy.delete(Keys.NAME_OR_ALIAS);
    return copy;
  }

  getSpecies() {
    return parseOrDefault(
      z.nativeEnum(Species).array().default([]),
      this.getAll(Keys.SPECIES)
    );
  }

  getAges() {
    return parseOrDefault(
      z.nativeEnum(AnimalAge).array().default([]),
      this.getAll(Keys.AGE)
    );
  }

  getStatuses() {
    return parseOrDefault(
      z.nativeEnum(Status).array().default([]),
      this.getAll(Keys.STATUS)
    );
  }

  setStatuses(statuses: Status[]) {
    const copy = new AnimalSearchParams(this);
    copy.delete(Keys.STATUS);
    statuses.forEach((status) => {
      copy.append(Keys.STATUS, status);
    });

    return copy;
  }

  getManagersId() {
    return parseOrDefault(
      z.string().uuid().array().default([]),
      this.getAll(Keys.MANAGERS_ID)
    );
  }

  setManagersId(managersId: string[]) {
    const copy = new AnimalSearchParams(this);
    copy.delete(Keys.MANAGERS_ID);
    managersId.forEach((managerId) => {
      copy.append(Keys.MANAGERS_ID, managerId);
    });

    return copy;
  }

  getMinPickUpDate() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(Keys.MIN_PICK_UP_DATE)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).startOf("day").toJSDate();
  }

  deleteMinPickUpDate() {
    const copy = new AnimalSearchParams(this);
    copy.delete(Keys.MIN_PICK_UP_DATE);
    return copy;
  }

  getMaxPickUpDate() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(Keys.MAX_PICK_UP_DATE)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).endOf("day").toJSDate();
  }

  deleteMaxPickUpDate() {
    const copy = new AnimalSearchParams(this);
    copy.delete(Keys.MAX_PICK_UP_DATE);
    return copy;
  }
}

function ensureDate(value: unknown) {
  if (typeof value === "string") {
    return DateTime.fromISO(value).toJSDate();
  }

  return value;
}
