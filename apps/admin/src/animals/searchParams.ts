import { AnimalAge } from "@animeaux/shared";
import { AdoptionOption, PickUpReason, Species, Status } from "@prisma/client";
import isEqual from "lodash.isequal";
import orderBy from "lodash.orderby";
import { DateTime } from "luxon";
import { z } from "zod";
import { ensureBoolean, ensureDate, parseOrDefault } from "~/core/schemas";

export class AnimalSearchParams extends URLSearchParams {
  static readonly Sort = {
    BIRTHDATE: "BIRTHDATE",
    NAME: "NAME",
    PICK_UP: "PICK_UP",
    RELEVANCE: "RELEVANCE",
    VACCINATION: "VACCINATION",
  } as const;

  static readonly DEFAULT_SORT = AnimalSearchParams.Sort.RELEVANCE;

  static readonly IsSterilized = {
    YES: "YES",
    NO: "NO",
    NOT_MANDATORY: "NOT_MANDATORY",
  } as const;

  static readonly Keys = {
    ADOPTION_OPTION: "adoptionOption",
    AGE: "age",
    FOSTER_FAMILIES_ID: "ff",
    IS_STERILIZED: "isSterilized",
    MANAGERS_ID: "manager",
    MAX_ADOPTION_DATE: "maxAdoption",
    MAX_BIRTHDATE: "maxBirth",
    MAX_PICK_UP_DATE: "pickUpMax",
    MAX_VACCINATION: "vaccMax",
    MIN_ADOPTION_DATE: "minAdoption",
    MIN_BIRTHDATE: "minBirth",
    MIN_PICK_UP_DATE: "pickUpMin",
    MIN_VACCINATION: "vaccMin",
    NAME_OR_ALIAS: "q",
    NO_VACCINATION: "noVacc",
    PICK_UP_LOCATION: "pickUpLoc",
    PICK_UP_REASON: "pickUpReason",
    SORT: "sort",
    SPECIES: "species",
    STATUS: "status",
  };

  isEmpty() {
    return this.areFiltersEqual(new AnimalSearchParams());
  }

  areFiltersEqual(other: AnimalSearchParams) {
    return (
      isEqual(
        orderBy(this.getAdoptionOptions()),
        orderBy(other.getAdoptionOptions())
      ) &&
      isEqual(orderBy(this.getAges()), orderBy(other.getAges())) &&
      isEqual(
        orderBy(this.getFosterFamiliesId()),
        orderBy(other.getFosterFamiliesId())
      ) &&
      isEqual(
        orderBy(this.getIsSterilized()),
        orderBy(other.getIsSterilized())
      ) &&
      isEqual(orderBy(this.getManagersId()), orderBy(other.getManagersId())) &&
      isEqual(this.getMaxAdoptionDate(), other.getMaxAdoptionDate()) &&
      isEqual(this.getMaxBirthdate(), other.getMaxBirthdate()) &&
      isEqual(this.getMaxPickUpDate(), other.getMaxPickUpDate()) &&
      isEqual(this.getMaxVaccinationDate(), other.getMaxVaccinationDate()) &&
      isEqual(this.getMinAdoptionDate(), other.getMinAdoptionDate()) &&
      isEqual(this.getMinBirthdate(), other.getMinBirthdate()) &&
      isEqual(this.getMinPickUpDate(), other.getMinPickUpDate()) &&
      isEqual(this.getMinVaccinationDate(), other.getMinVaccinationDate()) &&
      isEqual(this.getNameOrAlias(), other.getNameOrAlias()) &&
      isEqual(
        orderBy(this.getPickUpLocations()),
        orderBy(other.getPickUpLocations())
      ) &&
      isEqual(
        orderBy(this.getPickUpReasons()),
        orderBy(other.getPickUpReasons())
      ) &&
      isEqual(orderBy(this.getSpecies()), orderBy(other.getSpecies())) &&
      isEqual(orderBy(this.getStatuses()), orderBy(other.getStatuses()))
    );
  }

  getSort() {
    return parseOrDefault(
      z
        .nativeEnum(AnimalSearchParams.Sort)
        .default(AnimalSearchParams.DEFAULT_SORT),
      this.get(AnimalSearchParams.Keys.SORT)
    );
  }

  setSort(
    sort:
      | null
      | (typeof AnimalSearchParams.Sort)[keyof typeof AnimalSearchParams.Sort]
  ) {
    const copy = new AnimalSearchParams(this);

    if (sort != null) {
      copy.set(AnimalSearchParams.Keys.SORT, sort);
    } else if (copy.has(AnimalSearchParams.Keys.SORT)) {
      copy.delete(AnimalSearchParams.Keys.SORT);
    }

    return copy;
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

  getNoVaccination() {
    return parseOrDefault(
      z.preprocess(ensureBoolean, z.boolean()).default(false),
      this.get(AnimalSearchParams.Keys.NO_VACCINATION)
    );
  }

  getSpecies() {
    return parseOrDefault(
      z.nativeEnum(Species).array().default([]),
      this.getAll(AnimalSearchParams.Keys.SPECIES)
    );
  }

  setSpecies(species: Species[]) {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.SPECIES);
    species.forEach((species) => {
      copy.append(AnimalSearchParams.Keys.SPECIES, species);
    });

    return copy;
  }

  getAges() {
    return parseOrDefault(
      z.nativeEnum(AnimalAge).array().default([]),
      this.getAll(AnimalSearchParams.Keys.AGE)
    );
  }

  getAdoptionOptions() {
    return parseOrDefault(
      z.nativeEnum(AdoptionOption).array().default([]),
      this.getAll(AnimalSearchParams.Keys.ADOPTION_OPTION)
    );
  }

  getMinAdoptionDate() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(AnimalSearchParams.Keys.MIN_ADOPTION_DATE)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).startOf("day").toJSDate();
  }

  deleteMinAdoptionDate() {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.MIN_ADOPTION_DATE);
    return copy;
  }

  getMaxAdoptionDate() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(AnimalSearchParams.Keys.MAX_ADOPTION_DATE)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).startOf("day").toJSDate();
  }

  deleteMaxAdoptionDate() {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.MAX_ADOPTION_DATE);
    return copy;
  }

  getMinBirthdate() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(AnimalSearchParams.Keys.MIN_BIRTHDATE)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).startOf("day").toJSDate();
  }

  deleteMinBirthdate() {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.MIN_BIRTHDATE);
    return copy;
  }

  getMaxBirthdate() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(AnimalSearchParams.Keys.MAX_BIRTHDATE)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).startOf("day").toJSDate();
  }

  deleteMaxBirthdate() {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.MAX_BIRTHDATE);
    return copy;
  }

  setMaxBirthdate(maxBirthdate: null | Date) {
    const copy = new AnimalSearchParams(this);

    if (maxBirthdate != null) {
      copy.set(
        AnimalSearchParams.Keys.MAX_BIRTHDATE,
        DateTime.fromJSDate(maxBirthdate).toISODate()
      );
    } else if (copy.has(AnimalSearchParams.Keys.MAX_BIRTHDATE)) {
      copy.delete(AnimalSearchParams.Keys.MAX_BIRTHDATE);
    }

    return copy;
  }

  getMinVaccinationDate() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(AnimalSearchParams.Keys.MIN_VACCINATION)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).startOf("day").toJSDate();
  }

  deleteMinVaccinationDate() {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.MIN_VACCINATION);
    return copy;
  }

  getMaxVaccinationDate() {
    const date = parseOrDefault(
      z.preprocess(ensureDate, z.date()).optional(),
      this.get(AnimalSearchParams.Keys.MAX_VACCINATION)
    );

    if (date == null) {
      return null;
    }

    return DateTime.fromJSDate(date).startOf("day").toJSDate();
  }

  deleteMaxVaccinationDate() {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.MAX_VACCINATION);
    return copy;
  }

  setMaxVaccinationDate(maxVaccinationDate: null | Date) {
    const copy = new AnimalSearchParams(this);

    if (maxVaccinationDate != null) {
      copy.set(
        AnimalSearchParams.Keys.MAX_VACCINATION,
        DateTime.fromJSDate(maxVaccinationDate).toISODate()
      );
    } else if (copy.has(AnimalSearchParams.Keys.MAX_VACCINATION)) {
      copy.delete(AnimalSearchParams.Keys.MAX_VACCINATION);
    }

    return copy;
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

  getPickUpReasons() {
    return parseOrDefault(
      z.nativeEnum(PickUpReason).array().default([]),
      this.getAll(AnimalSearchParams.Keys.PICK_UP_REASON)
    );
  }

  getIsSterilized() {
    return parseOrDefault(
      z.nativeEnum(AnimalSearchParams.IsSterilized).array().default([]),
      this.getAll(AnimalSearchParams.Keys.IS_STERILIZED)
    );
  }

  setIsSterilized(
    isSterilized: (typeof AnimalSearchParams.IsSterilized)[keyof typeof AnimalSearchParams.IsSterilized][]
  ) {
    const copy = new AnimalSearchParams(this);
    copy.delete(AnimalSearchParams.Keys.IS_STERILIZED);
    isSterilized.forEach((isSterilized) => {
      copy.append(AnimalSearchParams.Keys.IS_STERILIZED, isSterilized);
    });

    return copy;
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
