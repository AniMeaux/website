import faker from "@faker-js/faker";
import {
  AdoptionOption,
  EventCategory,
  Gender,
  PickUpReason,
  Prisma,
  PrismaClient,
  Species,
  Status,
  UserGroup,
} from "@prisma/client";
import { DateTime } from "luxon";
import { generatePasswordHash } from "../src/core/password";
import {
  ACTIVE_ANIMAL_STATUS,
  NON_ACTIVE_ANIMAL_STATUS,
} from "../src/entities/animal.entity";

faker.setLocale("fr");

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "NotASword1!";

seedData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());

async function seedData() {
  console.log("🌱 Seeding data...");

  await Promise.all([
    seedUsers(),
    seedFosterFamilies(),
    seedBreeds(),
    seedColors(),
    seedEvents(),
  ]);

  await seedAnimals();

  console.log(`🎉 Data is seeded`);
}

async function seedUsers() {
  await prisma.user.create({
    data: {
      email: "admin@animeaux.org",
      displayName: "Admin",
      groups: [UserGroup.ADMIN],
      isDisabled: false,
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
            displayName: faker.name.firstName(),
            groups: [group],
            isDisabled: false,
            password: {
              create: { hash: await generatePasswordHash(DEFAULT_PASSWORD) },
            },
          },
        })
    )
  );
}

async function seedFosterFamilies() {
  await prisma.fosterFamily.createMany({
    data: repeate({ min: 80, max: 120 }, () => ({
      email: faker.internet.email(),
      displayName: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      zipCode: faker.address.zipCode(),
      city: faker.address.city(),
    })),
  });
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
      { species: Species.RODENT, name: "Cochon d'Inde" },
      { species: Species.RODENT, name: "Hamster" },
      { species: Species.RODENT, name: "Lapin" },
      { species: Species.RODENT, name: "Rat" },
    ],
  });
}

async function seedColors() {
  await prisma.color.createMany({
    data: [
      { name: "Tigré et gris" },
      { name: "Noir et blanc" },
      { name: "Bleu merle" },
      { name: "Crème" },
      { name: "Tigré" },
      { name: "Chocolat" },
      { name: "Beige" },
      { name: "Tricolore" },
      { name: "Roux" },
      { name: "Bringé" },
      { name: "Fauve et noir" },
      { name: "Tigré et blanc" },
      { name: "Tigré et roux" },
      { name: "Ecaille de tortue" },
      { name: "Noir" },
      { name: "Roux et blanc" },
      { name: "Typé siamois" },
      { name: "Gris" },
      { name: "Fauve" },
      { name: "Gris et blanc" },
      { name: "Marron et blanc" },
      { name: "Blanc" },
      { name: "Marron" },
      { name: "Bleu" },
    ],
  });
}

async function seedEvents() {
  await prisma.event.createMany({
    data: repeate({ min: 5, max: 10 }, () => {
      const startDate = faker.date.between(
        "2021-01-01",
        DateTime.now().plus({ year: 1 }).toJSDate()
      );

      return {
        category: faker.helpers.arrayElement(Object.values(EventCategory)),
        title: faker.commerce.productName(),
        location: faker.address.streetAddress(true),
        shortDescription: faker.commerce.productDescription(),
        description: faker.lorem.paragraphs(
          faker.datatype.number({ min: 1, max: 5 }),
          "\n\n"
        ),
        startDate,
        endDate: faker.date.between(
          startDate,
          DateTime.fromJSDate(startDate).plus({ days: 3 }).toJSDate()
        ),
        isFullDay: faker.datatype.boolean(),
        image: faker.helpers.maybe(() => faker.datatype.uuid()),
      };
    }),
  });
}

async function seedAnimals() {
  const [managers, breeds, colors, fosterFamilies] = await Promise.all([
    prisma.user.findMany({
      where: { groups: { has: UserGroup.ANIMAL_MANAGER } },
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
    }
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
        })
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
        })
      ),
    }),
  ]);
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
  const birthdate = faker.date.past(20);
  const species = faker.helpers.arrayElement(Object.values(Species));
  const breeds = breedsBySpecies[species];
  const status = faker.helpers.arrayElement(possibleStatus);
  const pickUpDate = faker.date.between(birthdate, DateTime.now().toJSDate());

  return {
    name: faker.name.firstName(),
    alias: faker.helpers.maybe(() => faker.name.firstName()),
    birthdate,
    gender: faker.helpers.arrayElement(Object.values(Gender)),
    species,
    breedId: breeds.length > 0 ? faker.helpers.arrayElement(breeds) : null,
    colorId: faker.helpers.maybe(() => faker.helpers.arrayElement(colors).id),
    description: faker.helpers.maybe(() =>
      faker.lorem.paragraphs(faker.datatype.number({ min: 1, max: 5 }), "\n\n")
    ),
    avatar: faker.datatype.uuid(),
    pictures: faker.helpers.maybe(() =>
      repeate({ min: 1, max: 5 }, () => faker.datatype.uuid())
    ),
    pickUpDate,
    pickUpLocation: faker.helpers.maybe(() => faker.address.city()),
    pickUpReason: faker.helpers.arrayElement(Object.values(PickUpReason)),
    status,
    adoptionDate:
      status === Status.ADOPTED
        ? faker.date.between(pickUpDate, DateTime.now().toJSDate())
        : null,
    adoptionOption:
      status === Status.ADOPTED
        ? faker.helpers.maybe(() =>
            faker.helpers.arrayElement(Object.values(AdoptionOption))
          )
        : null,
    managerId: faker.helpers.arrayElement(managers).id,
    fosterFamilyId: ACTIVE_ANIMAL_STATUS.includes(status)
      ? faker.helpers.arrayElement(fosterFamilies).id
      : null,
    iCadNumber: faker.helpers.maybe(() => faker.random.numeric(15)),
    comments: faker.helpers.maybe(() => faker.lorem.lines()),
    isOkCats: nullableBoolean(),
    isOkChildren: nullableBoolean(),
    isOkDogs: nullableBoolean(),
    isSterilized: faker.datatype.boolean(),
  };
}

function nullableBoolean() {
  return faker.helpers.maybe(() => faker.datatype.boolean(), {
    probability: 2 / 3,
  });
}

function repeate<T>(
  options: NonNullable<Parameters<typeof faker.datatype.number>[0]>,
  cb: () => T
) {
  return Array.from({ length: faker.datatype.number(options) }, cb);
}
