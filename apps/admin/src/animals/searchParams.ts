import { AnimalAge } from "@animeaux/shared";
import { Species, Status } from "@prisma/client";
import isEqual from "lodash.isequal";
import orderBy from "lodash.orderby";
import { DateTime } from "luxon";
import { z } from "zod";
import { ensureDate, parseOrDefault } from "~/core/schemas";

export class AnimalSearchParams extends URLSearchParams {
  static readonly Sort = {
    NAME: "NAME",
    PICK_UP: "PICK_UP",
  };

  static readonly Keys = {
    AGE: "age",
    FOSTER_FAMILIES_ID: "ff",
    MANAGERS_ID: "manager",
    MAX_PICK_UP_DATE: "max",
    MIN_PICK_UP_DATE: "min",
    NAME_OR_ALIAS: "q",
    PICK_UP_LOCATION: "pickUp",
    SORT: "sort",
    SPECIES: "species",
    STATUS: "status",
  };

  isEmpty() {
    return this.areFiltersEqual(new AnimalSearchParams());
  }

  areFiltersEqual(other: AnimalSearchParams) {
    return (
      isEqual(orderBy(this.getSpecies()), orderBy(other.getSpecies())) &&
      isEqual(this.getNameOrAlias(), other.getNameOrAlias()) &&
      isEqual(orderBy(this.getStatuses()), orderBy(other.getStatuses())) &&
      isEqual(orderBy(this.getAges()), orderBy(other.getAges())) &&
      isEqual(orderBy(this.getManagersId()), orderBy(other.getManagersId())) &&
      isEqual(
        orderBy(this.getFosterFamiliesId()),
        orderBy(other.getFosterFamiliesId())
      ) &&
      isEqual(this.getMinPickUpDate(), other.getMinPickUpDate()) &&
      isEqual(this.getMaxPickUpDate(), other.getMaxPickUpDate()) &&
      isEqual(
        orderBy(this.getPickUpLocations()),
        orderBy(other.getPickUpLocations())
      )
    );
  }

  getSort() {
    return parseOrDefault(
      z
        .nativeEnum(AnimalSearchParams.Sort)
        .default(AnimalSearchParams.Sort.PICK_UP),
      this.get(AnimalSearchParams.Keys.SORT)
    );
  }

  getNameOrAlias() {
    return this.get(AnimalSearchParams.Keys.NAME_OR_ALIAS)?.trim() || null;
  }

  setNameOrAlias(nameOrAlias: string) {
    const copy = new AnimalSearchParams(this);

    nameOrAlias = nameOrAlias.trim();
    if (nameOrAlias !== "") {
      copy.set(AnimalSearchParams.Keys.NAME_OR_ALIAS, nameOrAlias);
    } else if (copy.has(AnimalSearchParams.Keys.NAME_OR_ALIAS)) {
      copy.delete(AnimalSearchParams.Keys.NAME_OR_ALIAS);
    }

    return copy;
  }

  deleteNameOrAlias() {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.NAME_OR_ALIAS);
    return copy;
  }

  getSpecies() {
    return parseOrDefault(
      z.nativeEnum(Species).array().default([]),
      this.getAll(AnimalSearchParams.Keys.SPECIES)
    );
  }

  getAges() {
    return parseOrDefault(
      z.nativeEnum(AnimalAge).array().default([]),
      this.getAll(AnimalSearchParams.Keys.AGE)
    );
  }

  getStatuses() {
    return parseOrDefault(
      z.nativeEnum(Status).array().default([]),
      this.getAll(AnimalSearchParams.Keys.STATUS)
    );
  }

  setStatuses(statuses: Status[]) {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.STATUS);
    statuses.forEach((status) => {
      copy.append(AnimalSearchParams.Keys.STATUS, status);
    });

    return copy;
  }

  getManagersId() {
    return parseOrDefault(
      z.string().uuid().array().default([]),
      this.getAll(AnimalSearchParams.Keys.MANAGERS_ID)
    );
  }

  setManagersId(managersId: string[]) {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.MANAGERS_ID);
    managersId.forEach((managerId) => {
      copy.append(AnimalSearchParams.Keys.MANAGERS_ID, managerId);
    });

    return copy;
  }

  getFosterFamiliesId() {
    return parseOrDefault(
      z.string().uuid().array().default([]),
      this.getAll(AnimalSearchParams.Keys.FOSTER_FAMILIES_ID)
    );
  }

  setFosterFamiliesId(fosterFamiliesId: string[]) {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.FOSTER_FAMILIES_ID);
    fosterFamiliesId.forEach((fosterFamilyId) => {
      copy.append(AnimalSearchParams.Keys.FOSTER_FAMILIES_ID, fosterFamilyId);
    });

    return copy;
  }

  getMinPickUpDate() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(AnimalSearchParams.Keys.MIN_PICK_UP_DATE)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).startOf("day").toJSDate();
  }

  deleteMinPickUpDate() {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.MIN_PICK_UP_DATE);
    return copy;
  }

  getMaxPickUpDate() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(AnimalSearchParams.Keys.MAX_PICK_UP_DATE)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).endOf("day").toJSDate();
  }

  deleteMaxPickUpDate() {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.MAX_PICK_UP_DATE);
    return copy;
  }

  getPickUpLocations() {
    return parseOrDefault(
      z.string().array().default([]),
      this.getAll(AnimalSearchParams.Keys.PICK_UP_LOCATION)
    );
  }
}

export class PickUpLocationSearchParams extends URLSearchParams {
  static readonly Keys = {
    TEXT: "q",
  };

  getText() {
    return this.get(PickUpLocationSearchParams.Keys.TEXT)?.trim() || null;
  }

  setText(text: string) {
    const copy = new PickUpLocationSearchParams(this);

    text = text.trim();
    if (text !== "") {
      copy.set(PickUpLocationSearchParams.Keys.TEXT, text);
    } else if (copy.has(PickUpLocationSearchParams.Keys.TEXT)) {
      copy.delete(PickUpLocationSearchParams.Keys.TEXT);
    }

    return copy;
  }
}
