#!/usr/bin/env tsx

import { ACTIVE_ANIMAL_STATUS, NON_ACTIVE_ANIMAL_STATUS } from "@animeaux/core";
import { generatePasswordHash } from "@animeaux/password";
import { fakerFR as faker } from "@faker-js/faker";
import type { Prisma } from "@prisma/client";
import {
  AdoptionOption,
  Diagnosis,
  FosterFamilyAvailability,
  FosterFamilyGarden,
  FosterFamilyHousing,
  Gender,
  PickUpReason,
  PrismaClient,
  ScreeningResult,
  ShowActivityField,
  ShowActivityTarget,
  ShowExhibitorApplicationDiscoverySource,
  ShowExhibitorApplicationLegalStatus,
  ShowExhibitorApplicationStatus,
  ShowExhibitorStatus,
  ShowSponsorshipCategory,
  ShowStandSize,
  ShowStandZone,
  Species,
  Status,
  UserGroup,
} from "@prisma/client";
import { DateTime } from "luxon";

const DEFAULT_PASSWORD = "NotASword1!";

console.log("🌱 Seeding data...");

const prisma = new PrismaClient();

const seeds = {
  animals: Promise.resolve().then(seedAnimals),
  breeds: Promise.resolve().then(seedBreeds),
  colors: Promise.resolve().then(seedColors),
  events: Promise.resolve().then(seedEvents),
  fosterFamilies: Promise.resolve().then(seedFosterFamilies),
  pressArticles: Promise.resolve().then(seedPressArticle),
  showAnimations: Promise.resolve().then(seedShowAnimations),
  showExhibitorApplications: Promise.resolve().then(
    seedShowExhibitorApplications,
  ),
  showExhibitors: Promise.resolve().then(seedShowExhibitors),
  showExhibitorsDogs: Promise.resolve().then(seedShowExhibitorsDogs),
  showSponsors: Promise.resolve().then(seedShowSponsors),
  showProviders: Promise.resolve().then(seedShowProviders),
  users: Promise.resolve().then(seedUsers),
};

try {
  await Promise.all(Object.values(seeds));
} finally {
  await prisma.$disconnect();
}

console.log(`🎉 Data is seeded`);

async function seedUsers() {
  await prisma.user.create({
    data: {
      email: "admin@animeaux.org",
      displayName: "Admin",
      groups: [UserGroup.ADMIN, UserGroup.ANIMAL_MANAGER, UserGroup.VOLUNTEER],
      isDisabled: false,
      shouldChangePassword: false,
      password: {
        create: { hash: await generatePasswordHash(DEFAULT_PASSWORD) },
      },
    },
  });

  await Promise.all(
    Object.values(UserGroup).map(
      async (group) =>
        await prisma.user.create({
          data: {
            email: faker.internet.email(),
            displayName: faker.person.firstName(),
            groups: [group],
            isDisabled: false,
            shouldChangePassword: false,
            password: {
              create: { hash: await generatePasswordHash(DEFAULT_PASSWORD) },
            },
          },
        }),
    ),
  );

  await Promise.all(
    repeate(
      { min: 5, max: 10 },
      async () =>
        await prisma.user.create({
          data: {
            email: faker.internet.email(),
            displayName: faker.person.firstName(),
            groups: [UserGroup.VOLUNTEER, UserGroup.ANIMAL_MANAGER],
            isDisabled: faker.datatype.boolean(),
            shouldChangePassword: false,
            password: {
              create: { hash: await generatePasswordHash(DEFAULT_PASSWORD) },
            },
          },
        }),
    ),
  );

  const count = await prisma.user.count();
  console.log(`- 👍 ${count} users`);
}

async function seedFosterFamilies() {
  await prisma.fosterFamily.createMany({
    data: repeate({ min: 80, max: 120 }, () => {
      const availability = faker.helpers.arrayElement(
        Object.values(FosterFamilyAvailability),
      );

      return {
        isBanned: faker.datatype.boolean({ probability: 1 / 10 }),
        availability,
        availabilityExpirationDate:
          availability === FosterFamilyAvailability.UNKNOWN
            ? undefined
            : faker.helpers.maybe(() =>
                DateTime.fromJSDate(faker.date.soon({ days: 30 }))
                  .startOf("day")
                  .toJSDate(),
              ),
        comments: faker.helpers.maybe(() => faker.lorem.lines()),
        displayName: faker.person.fullName(),
        email: faker.internet.email(),
        garden: faker.helpers.arrayElement(Object.values(FosterFamilyGarden)),
        housing: faker.helpers.arrayElement(Object.values(FosterFamilyHousing)),
        phone: faker.phone.number(),
        speciesAlreadyPresent: faker.helpers.maybe(() =>
          faker.helpers.arrayElements(Object.values(Species)),
        ),
        speciesToHost: faker.helpers.maybe(() =>
          faker.helpers.arrayElements(Object.values(Species)),
        ),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode(),
      };
    }),
  });

  const count = await prisma.fosterFamily.count();
  console.log(`- 👍 ${count} foster families`);
}

async function seedBreeds() {
  await prisma.breed.createMany({
    data: [
      { species: Species.CAT, name: "Bengal" },
      { species: Species.CAT, name: "Chartreux" },
      { species: Species.CAT, name: "Européen" },
      { species: Species.CAT, name: "Maine Coon" },
      { species: Species.CAT, name: "Norvégien" },
      { species: Species.CAT, name: "Persan" },
      { species: Species.CAT, name: "Siamois" },
      { species: Species.DOG, name: "American Bully" },
      { species: Species.DOG, name: "Beagle" },
      { species: Species.DOG, name: "Beauceron" },
      { species: Species.DOG, name: "Berger Allemand" },
      { species: Species.DOG, name: "Berger Australien" },
      { species: Species.DOG, name: "Berger Serbe" },
      { species: Species.DOG, name: "Bichon" },
      { species: Species.DOG, name: "Border Collie" },
      { species: Species.DOG, name: "Bouledogue Américain" },
      { species: Species.DOG, name: "Bouledogue Français" },
      { species: Species.DOG, name: "Boxer" },
      { species: Species.DOG, name: "Braque Allemand" },
      { species: Species.DOG, name: "Bulldog Anglais" },
      { species: Species.DOG, name: "Cairn Terrier" },
      { species: Species.DOG, name: "Cane Corso" },
      { species: Species.DOG, name: "Caniche" },
      { species: Species.DOG, name: "Carlin" },
      { species: Species.DOG, name: "Cavalier King Charles" },
      { species: Species.DOG, name: "Chihuahua" },
      { species: Species.DOG, name: "Chow-Chow" },
      { species: Species.DOG, name: "Cocker" },
      { species: Species.DOG, name: "Croisé" },
      { species: Species.DOG, name: "Dalmatien" },
      { species: Species.DOG, name: "Dogue Argentin" },
      { species: Species.DOG, name: "Épagneul Breton" },
      { species: Species.DOG, name: "Golden Retriever" },
      { species: Species.DOG, name: "Griffon" },
      { species: Species.DOG, name: "Husky" },
      { species: Species.DOG, name: "Jack Russel" },
      { species: Species.DOG, name: "Labrador" },
      { species: Species.DOG, name: "Malinois" },
      { species: Species.DOG, name: "Pékinois" },
      { species: Species.DOG, name: "Pinscher" },
      { species: Species.DOG, name: "Rottweiler" },
      { species: Species.DOG, name: "Setter Irlandais" },
      { species: Species.DOG, name: "Shiba Inu" },
      { species: Species.DOG, name: "Shih Tzu" },
      { species: Species.DOG, name: "Staff" },
      { species: Species.DOG, name: "Teckel" },
      { species: Species.DOG, name: "Typé staff" },
      { species: Species.DOG, name: "Yorkshire" },
      { species: Species.RODENT, name: "Cochon d’Inde" },
      { species: Species.RODENT, name: "Hamster" },
      { species: Species.RODENT, name: "Lapin" },
      { species: Species.RODENT, name: "Rat" },
    ],
  });

  const count = await prisma.breed.count();
  console.log(`- 👍 ${count} breeds`);
}

async function seedColors() {
  await prisma.color.createMany({
    data: [
      { name: "Beige" },
      { name: "Blanc" },
      { name: "Bleu merle" },
      { name: "Bleu" },
      { name: "Bringé" },
      { name: "Chocolat" },
      { name: "Crème" },
      { name: "Ecaille de tortue" },
      { name: "Fauve et noir" },
      { name: "Fauve" },
      { name: "Gris et blanc" },
      { name: "Gris" },
      { name: "Marron et blanc" },
      { name: "Marron" },
      { name: "Noir et blanc" },
      { name: "Noir" },
      { name: "Roux et blanc" },
      { name: "Roux" },
      { name: "Tigré et blanc" },
      { name: "Tigré et gris" },
      { name: "Tigré et roux" },
      { name: "Tigré" },
      { name: "Tricolore" },
      { name: "Typé siamois" },
    ],
  });

  const count = await prisma.color.count();
  console.log(`- 👍 ${count} colors`);
}

async function seedEvents() {
  const now = DateTime.now();

  await Promise.all([
    prisma.event.createMany({
      data: repeate({ min: 10, max: 20 }, () =>
        createEventInput({
          minStartDate: now.minus({ year: 1 }).toJSDate(),
          maxStartDate: now.toJSDate(),
        }),
      ),
    }),

    prisma.event.createMany({
      data: repeate({ min: 10, max: 20 }, () =>
        createEventInput({
          minStartDate: now.toJSDate(),
          maxStartDate: now.plus({ year: 1 }).toJSDate(),
        }),
      ),
    }),
  ]);

  const count = await prisma.event.count();
  console.log(`- 👍 ${count} events`);
}

function createEventInput({
  minStartDate,
  maxStartDate,
}: {
  minStartDate: Date;
  maxStartDate: Date;
}): Prisma.EventCreateManyInput {
  const startDate = faker.date.between({
    from: minStartDate,
    to: maxStartDate,
  });

  return {
    title: faker.commerce.productName(),
    location: faker.location.streetAddress(true),
    url: faker.helpers.maybe(() => faker.internet.url()),
    description: faker.commerce.productDescription(),
    startDate,
    endDate: faker.date.between({
      from: startDate,
      to: DateTime.fromJSDate(startDate).plus({ days: 3 }).toJSDate(),
    }),
    isFullDay: faker.datatype.boolean(),
    image: faker.string.uuid(),
    isVisible: faker.datatype.boolean(),
  };
}

async function seedAnimals() {
  await Promise.all([
    seeds.users,
    seeds.breeds,
    seeds.colors,
    seeds.fosterFamilies,
  ]);

  const [managers, breeds, colors, fosterFamilies] = await Promise.all([
    prisma.user.findMany({
      where: { isDisabled: false, groups: { has: UserGroup.ANIMAL_MANAGER } },
      select: { id: true },
    }),
    prisma.breed.findMany({ select: { id: true, species: true } }),
    prisma.color.findMany({ select: { id: true } }),
    prisma.fosterFamily.findMany({ select: { id: true } }),
  ]);

  const breedsBySpecies = breeds.reduce<Record<Species, string[]>>(
    (breedsBySpecies, breed) => {
      breedsBySpecies[breed.species].push(breed.id);
      return breedsBySpecies;
    },
    {
      [Species.BIRD]: [],
      [Species.CAT]: [],
      [Species.DOG]: [],
      [Species.REPTILE]: [],
      [Species.RODENT]: [],
    },
  );

  await Promise.all([
    prisma.animal.createMany({
      data: repeate({ min: 10, max: 50 }, () =>
        createAnimalInput({
          possibleStatus: ACTIVE_ANIMAL_STATUS,
          breedsBySpecies,
          colors,
          managers,
          fosterFamilies,
        }),
      ),
    }),

    prisma.animal.createMany({
      data: repeate({ min: 100, max: 200 }, () =>
        createAnimalInput({
          possibleStatus: NON_ACTIVE_ANIMAL_STATUS,
          breedsBySpecies,
          colors,
          managers,
          fosterFamilies,
        }),
      ),
    }),
  ]);

  const count = await prisma.animal.count();
  console.log(`- 👍 ${count} animals`);
}

function createAnimalInput({
  possibleStatus,
  breedsBySpecies,
  colors,
  managers,
  fosterFamilies,
}: {
  possibleStatus: Status[];
  breedsBySpecies: Record<Species, string[]>;
  colors: { id: string }[];
  managers: { id: string }[];
  fosterFamilies: { id: string }[];
}): Prisma.AnimalCreateManyInput {
  const birthdate = DateTime.fromJSDate(faker.date.past({ years: 20 }))
    .startOf("day")
    .toJSDate();
  const species = faker.helpers.arrayElement(Object.values(Species));
  const breeds = breedsBySpecies[species];
  const status = faker.helpers.arrayElement(possibleStatus);
  const pickUpDate = DateTime.fromJSDate(
    faker.date.between({ from: birthdate, to: DateTime.now().toJSDate() }),
  )
    .startOf("day")
    .toJSDate();

  const isSterilized = faker.datatype.boolean();

  const nextVaccinationDate = faker.helpers.maybe(() =>
    DateTime.fromJSDate(faker.date.soon({ days: 30 }))
      .startOf("day")
      .toJSDate(),
  );

  return {
    adoptionDate:
      status === Status.ADOPTED
        ? DateTime.fromJSDate(
            faker.date.between({
              from: pickUpDate,
              to: DateTime.now().toJSDate(),
            }),
          )
            .startOf("day")
            .toJSDate()
        : null,
    adoptionOption:
      status === Status.ADOPTED
        ? faker.helpers.arrayElement(Object.values(AdoptionOption))
        : null,
    alias: faker.helpers.maybe(() => faker.person.firstName()),
    avatar: faker.string.uuid(),
    birthdate,
    breedId: breeds.length > 0 ? faker.helpers.arrayElement(breeds) : null,
    colorId: faker.helpers.maybe(() => faker.helpers.arrayElement(colors).id),
    comments: faker.helpers.maybe(() => faker.lorem.lines()),
    description: faker.helpers.maybe(() =>
      faker.lorem.paragraphs(faker.number.int({ min: 1, max: 5 }), "\n\n"),
    ),
    diagnosis:
      species === Species.DOG
        ? faker.helpers.arrayElement(Object.values(Diagnosis))
        : undefined,
    fosterFamilyId: ACTIVE_ANIMAL_STATUS.includes(status)
      ? faker.helpers.arrayElement(fosterFamilies).id
      : null,
    gender: faker.helpers.arrayElement(Object.values(Gender)),
    iCadNumber: faker.helpers.maybe(() => faker.string.numeric(15)),
    isOkCats: nullableBoolean(),
    isOkChildren: nullableBoolean(),
    isOkDogs: nullableBoolean(),
    isSterilizationMandatory: isSterilized || faker.datatype.boolean(),
    isSterilized,
    isVaccinationMandatory:
      nextVaccinationDate != null || faker.datatype.boolean(),
    managerId: faker.helpers.maybe(
      () => faker.helpers.arrayElement(managers).id,
      { probability: 3 / 4 },
    ),
    name: faker.person.firstName(),
    nextVaccinationDate,
    pickUpDate,
    pickUpLocation: faker.helpers.maybe(() => faker.location.city()),
    pickUpReason: faker.helpers.arrayElement(Object.values(PickUpReason)),
    pictures: faker.helpers.maybe(() =>
      repeate({ min: 1, max: 5 }, () => faker.string.uuid()),
    ),
    screeningFiv:
      species === Species.CAT
        ? faker.helpers.arrayElement(Object.values(ScreeningResult))
        : undefined,
    screeningFelv:
      species === Species.CAT
        ? faker.helpers.arrayElement(Object.values(ScreeningResult))
        : undefined,
    species,
    status,
  };
}

async function seedPressArticle() {
  await prisma.pressArticle.createMany({
    data: repeate({ min: 10, max: 20 }, () => ({
      image: faker.helpers.maybe(() =>
        faker.image.url({ width: 640, height: 480 }),
      ),
      publicationDate: DateTime.fromJSDate(faker.date.past({ years: 5 }))
        .startOf("day")
        .toJSDate(),
      publisherName: faker.internet.domainName(),
      title: faker.lorem
        .sentence(faker.number.int({ min: 3, max: 6 }))
        .replace(".", ""),
      url: faker.internet.url(),
    })),
  });

  const count = await prisma.pressArticle.count();
  console.log(`- 👍 ${count} press articles`);
}

async function seedShowProviders() {
  await prisma.showProvider.createMany({
    data: repeate({ min: 5, max: 10 }, () => ({
      isVisible: faker.datatype.boolean({ probability: 9 / 10 }),
      logoPath: faker.string.uuid(),
      name: faker.company.name(),
      url: faker.internet.url(),
    })),
  });

  const count = await prisma.showProvider.count();
  console.log(`- 👍 ${count} show providers`);
}

async function seedShowExhibitorApplications() {
  await prisma.showExhibitorApplication.createMany({
    data: repeate({ min: 100, max: 120 }, () => {
      const status = faker.helpers.arrayElement(
        Object.values(ShowExhibitorApplicationStatus),
      );

      const legalStatus = faker.helpers.maybe(
        () =>
          faker.helpers.arrayElement(
            Object.values(ShowExhibitorApplicationLegalStatus),
          ),
        { probability: 9 / 10 },
      );

      const discoverySource = faker.helpers.arrayElement(
        Object.values(ShowExhibitorApplicationDiscoverySource),
      );

      return {
        status,
        refusalMessage:
          status === ShowExhibitorApplicationStatus.REFUSED
            ? faker.lorem.paragraph()
            : undefined,

        contactLastname: faker.person.lastName(),
        contactFirstname: faker.person.firstName(),
        contactEmail: faker.internet.email(),
        contactPhone: faker.phone.number(),

        structureName: faker.company.name(),
        structureUrl: faker.internet.url(),
        structureLegalStatus: legalStatus,
        structureOtherLegalStatus:
          legalStatus == null ? faker.lorem.word() : undefined,
        structureSiret: faker.string.numeric({ length: 14 }),
        structureActivityDescription: faker.lorem
          .paragraph(faker.number.int({ min: 1, max: 5 }))
          .substring(0, 300),
        structureActivityTargets: faker.helpers.arrayElements(
          Object.values(ShowActivityTarget),
          { min: 1, max: 3 },
        ),
        structureActivityFields: faker.helpers.arrayElements(
          Object.values(ShowActivityField),
          { min: 1, max: 4 },
        ),
        structureAddress: faker.location.streetAddress(),
        structureZipCode: faker.location.zipCode(),
        structureCity: faker.location.city(),
        structureCountry: faker.location.country(),
        structureLogoPath: faker.string.uuid(),

        desiredStandSize: faker.helpers.arrayElement(
          Object.values(ShowStandSize),
        ),

        proposalForOnStageEntertainment: faker.helpers.maybe(
          () => faker.lorem.paragraph().substring(0, 512),
          { probability: 1 / 10 },
        ),

        sponsorshipCategory: faker.helpers.maybe(
          () =>
            faker.helpers.arrayElement(Object.values(ShowSponsorshipCategory)),
          { probability: 1 / 6 },
        ),

        motivation: faker.lorem
          .paragraphs(faker.number.int({ min: 1, max: 5 }), "\n\n")
          .substring(0, 1000),

        discoverySource,
        discoverySourceOther:
          discoverySource === ShowExhibitorApplicationDiscoverySource.OTHER
            ? faker.lorem.word()
            : undefined,

        comments: faker.helpers.maybe(
          () => faker.lorem.paragraph().substring(0, 512),
          { probability: 1 / 5 },
        ),
      };
    }),
  });

  const count = await prisma.showExhibitorApplication.count();
  console.log(`- 👍 ${count} show exhibitor applications`);
}

async function seedShowExhibitors() {
  await seeds.showExhibitorApplications;

  const applications = await prisma.showExhibitorApplication.findMany({
    where: { status: ShowExhibitorApplicationStatus.VALIDATED },
    select: {
      id: true,
      structureName: true,
      structureUrl: true,
      structureActivityTargets: true,
      structureActivityFields: true,
      structureLogoPath: true,
      desiredStandSize: true,
    },
  });

  await Promise.all(
    applications.map((application) => {
      const publicProfileStatus = faker.helpers.arrayElement(
        Object.values(ShowExhibitorStatus),
      );

      const descriptionStatus = faker.helpers.arrayElement(
        Object.values(ShowExhibitorStatus),
      );

      const onStandAnimationsStatus = faker.helpers.arrayElement(
        Object.values(ShowExhibitorStatus),
      );

      const documentStatus = faker.helpers.arrayElement(
        Object.values(ShowExhibitorStatus),
      );

      const dogsConfigurationStatus = faker.helpers.arrayElement(
        Object.values(ShowExhibitorStatus),
      );

      const standConfigurationStatus = faker.helpers.arrayElement(
        Object.values(ShowExhibitorStatus),
      );

      return prisma.showExhibitor.create({
        data: {
          isVisible: faker.datatype.boolean({ probability: 9 / 10 }),
          hasPaid: faker.datatype.boolean({ probability: 1 / 5 }),
          applicationId: application.id,

          // -- Profile --------------------------------------------------------

          name: application.structureName,

          publicProfileStatus,
          publicProfileStatusMessage:
            publicProfileStatus === ShowExhibitorStatus.TO_MODIFY
              ? faker.lorem.paragraph()
              : undefined,

          activityFields: application.structureActivityFields,
          activityTargets: application.structureActivityTargets,
          links: [application.structureUrl].concat(
            repeate({ min: 0, max: 2 }, () => faker.internet.url()),
          ),
          logoPath: application.structureLogoPath,

          descriptionStatus,
          descriptionStatusMessage:
            descriptionStatus === ShowExhibitorStatus.TO_MODIFY
              ? faker.lorem.paragraph()
              : undefined,
          description:
            descriptionStatus === ShowExhibitorStatus.TO_BE_FILLED
              ? undefined
              : faker.lorem.paragraph().substring(0, 512),

          onStandAnimationsStatus,
          onStandAnimationsStatusMessage:
            onStandAnimationsStatus === ShowExhibitorStatus.TO_MODIFY
              ? faker.lorem.paragraph()
              : undefined,
          onStandAnimations:
            onStandAnimationsStatus === ShowExhibitorStatus.TO_BE_FILLED
              ? undefined
              : faker.lorem.lines().substring(0, 256),

          // -- Documents ------------------------------------------------------

          documentStatus,
          documentStatusMessage:
            documentStatus === ShowExhibitorStatus.TO_MODIFY
              ? faker.lorem.paragraph()
              : undefined,

          folderId: faker.string.uuid(),

          ...faker.helpers.maybe(
            () => ({
              identificationFileId: faker.string.uuid(),
              insuranceFileId: faker.string.uuid(),
              kbisFileId: faker.string.uuid(),
            }),
            { probability: 1 / 2 },
          ),

          // -- Dogs Configuration ---------------------------------------------

          dogsConfigurationStatus,
          dogsConfigurationStatusMessage:
            dogsConfigurationStatus === ShowExhibitorStatus.TO_MODIFY
              ? faker.lorem.paragraph()
              : undefined,

          // -- Stand Configuration --------------------------------------------

          standConfigurationStatus,
          standConfigurationStatusMessage:
            standConfigurationStatus === ShowExhibitorStatus.TO_MODIFY
              ? faker.lorem.paragraph()
              : undefined,

          size: application.desiredStandSize,
          tableCount: faker.number.int({ min: 0, max: 3 }),
        },
      });
    }),
  );

  const count = await prisma.showExhibitor.count();
  console.log(`- 👍 ${count} show exhibitors`);
}

async function seedShowExhibitorsDogs() {
  await seeds.showExhibitors;

  const exhibitors = await prisma.showExhibitor.findMany({
    where: {
      dogsConfigurationStatus: { not: ShowExhibitorStatus.TO_BE_FILLED },
    },
    select: { id: true },
  });

  await Promise.all(
    exhibitors.map((exhibitor) =>
      prisma.showExhibitorDog.createMany({
        data: repeate({ min: 1, max: 3 }, () => ({
          exhibitorId: exhibitor.id,
          gender: faker.helpers.arrayElement(Object.values(Gender)),
          idNumber: faker.string.numeric(15),
          isCategorized: faker.datatype.boolean(),
          isSterilized: faker.datatype.boolean(),
        })),
      }),
    ),
  );

  const count = await prisma.showExhibitorDog.count();
  console.log(`- 👍 ${count} show exhibitors dogs`);
}

async function seedShowSponsors() {
  await seeds.showExhibitors;

  const exhibitors = await prisma.showExhibitor.findMany({
    where: {
      application: {
        sponsorshipCategory: { not: null },
      },
    },
    select: {
      isVisible: true,
      id: true,
      application: {
        select: {
          sponsorshipCategory: true,
        },
      },
    },
  });

  await prisma.showSponsor.createMany({
    data: [
      ...exhibitors.map((exhibitor) => ({
        isVisible: exhibitor.isVisible && faker.datatype.boolean(),
        exhibitorId: exhibitor.id,
        category: exhibitor.application.sponsorshipCategory!,
      })),
      ...repeate({ min: 2, max: 5 }, () => ({
        isVisible: faker.datatype.boolean(),
        category: faker.helpers.arrayElement(
          Object.values(ShowSponsorshipCategory),
        ),
        logoPath: faker.string.uuid(),
        name: faker.company.name(),
        url: faker.internet.url(),
      })),
    ],
  });

  const count = await prisma.showSponsor.count();
  console.log(`- 👍 ${count} show sponsors`);
}

async function seedShowAnimations() {
  await seeds.showExhibitors;

  const exhibitors = await prisma.showExhibitor.findMany({
    select: { id: true },
  });

  let times: { start: DateTime; end: DateTime }[] = [];

  [
    // Saturday.
    {
      start: DateTime.fromISO("2026-06-06T10:00:00.000+02:00"),
      end: DateTime.fromISO("2026-06-06T18:00:00.000+02:00"),
    },
    // Sunday.
    {
      start: DateTime.fromISO("2026-06-07T10:00:00.000+02:00"),
      end: DateTime.fromISO("2026-06-07T18:00:00.000+02:00"),
    },
  ].forEach((showDay) => {
    let startTime = showDay.start;

    while (showDay.end.diff(startTime, "minutes").as("minutes") >= 10) {
      let endTime = startTime.plus({
        minutes: faker.number.int({ min: 2, max: 9 }) * 5,
      });

      if (endTime > showDay.end) {
        endTime = showDay.end;
      }

      times.push({ start: startTime, end: endTime });
      startTime = endTime;
    }
  });

  times = faker.helpers.shuffle(times);

  times = times.slice(4);

  await Promise.all(
    times.map(({ start, end }) =>
      prisma.showAnimation.create({
        data: {
          isVisible: faker.datatype.boolean(0.9),
          description: faker.lorem.paragraph().substring(0, 512),
          startTime: start.toJSDate(),
          endTime: end.toJSDate(),
          registrationUrl: faker.helpers.maybe(() => faker.internet.url(), {
            probability: 1 / 5,
          }),
          zone: faker.helpers.arrayElement(Object.values(ShowStandZone)),
          animators: {
            connect: faker.helpers.arrayElements(exhibitors, {
              min: 0,
              max: 2,
            }),
          },
          targets: faker.helpers.arrayElements(
            Object.values(ShowActivityTarget),
            { min: 1, max: 3 },
          ),
        },
      }),
    ),
  );

  const count = await prisma.showAnimation.count();
  console.log(`- 👍 ${count} show animations`);
}

function nullableBoolean() {
  return faker.helpers.maybe(() => faker.datatype.boolean(), {
    probability: 2 / 3,
  });
}

function repeate<T>(
  options: NonNullable<Parameters<typeof faker.number.int>[0]>,
  cb: () => T,
) {
  return Array.from({ length: faker.number.int(options) }, cb);
}
