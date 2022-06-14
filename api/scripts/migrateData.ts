import {
  AnimalGender,
  AnimalSpecies,
  AnimalStatus,
  Trilean,
} from "@animeaux/shared";
import {
  AdoptionOption,
  EventCategory,
  PickUpReason,
  Prisma,
  PrismaClient,
  UserGroup,
} from "@prisma/client";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { DateTime } from "luxon";
import invariant from "tiny-invariant";
import { cleanUpFirebase, initializeFirebase } from "../src/core/firebase";
import { trileanToBoolean } from "../src/core/trilean";

const prisma = new PrismaClient();
initializeFirebase();

migrateData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    cleanUpFirebase();
    await prisma.$disconnect();
  });

async function migrateData() {
  console.log("🚚 Migrating data...");

  const [userIdsMapping] = await Promise.all([
    migrateUsers(),
    migrateFosterFamilies(),
    migrateBreeds(),
    migrateColors(),
    migrateEvents(),
  ]);

  await migrateAnimals(userIdsMapping);

  console.log(`🎉 Data is migrated`);
}

type UserFromStore = {
  id: string;
  groups: UserGroup[];
};

async function migrateUsers(): Promise<Map<string, string>> {
  const [usersSnapshot, usersFromAuth] = await Promise.all([
    getFirestore().collection("users").get(),
    getAuth().listUsers(),
  ]);

  const newUsers = await Promise.all(
    usersSnapshot.docs.map(async (doc) => {
      const userFromStore = doc.data() as UserFromStore;
      const userFromAuth = usersFromAuth.users.find(
        (userFromAuth) => userFromStore.id === userFromAuth.uid
      );

      invariant(
        userFromAuth != null,
        `User record is missing for ${userFromStore.id}`
      );

      invariant(
        userFromAuth.email != null,
        `User email is missing for ${userFromStore.id}`
      );

      invariant(
        userFromAuth.displayName != null,
        `User displayName is missing for ${userFromStore.id}`
      );

      return prisma.user.create({
        select: { id: true, legacyId: true },
        data: {
          legacyId: userFromAuth.uid,
          email: userFromAuth.email.trim(),
          displayName: userFromAuth.displayName.trim(),
          groups: userFromStore.groups,
          isDisabled: userFromAuth.disabled,
        },
      });
    })
  );

  return new Map(
    newUsers.map((user) => {
      invariant(user.legacyId, "Legacy user id is missing");
      return [user.legacyId, user.id];
    })
  );
}

type HostFamilyFromStore = {
  id: string;
  name: string;
  phone: string;
  email: string;
  zipCode: string;
  city: string;
  address: string;
};

async function migrateFosterFamilies() {
  const snapshots = await getFirestore().collection("hostFamilies").get();

  const hostFamilies = snapshots.docs.map(
    (doc) => doc.data() as HostFamilyFromStore
  );

  await prisma.fosterFamily.createMany({
    data: hostFamilies.map((hostFamily) => ({
      id: hostFamily.id,
      email: hostFamily.email.trim(),
      displayName: hostFamily.name.trim(),
      address: hostFamily.address.trim(),
      city: hostFamily.city.trim(),
      zipCode: hostFamily.zipCode.trim(),
      phone: hostFamily.phone.trim(),
    })),
  });
}

type AnimalBreedFromStore = {
  id: string;
  name: string;
  species: AnimalSpecies;
};

async function migrateBreeds() {
  const snapshots = await getFirestore().collection("animalBreeds").get();

  const breeds = snapshots.docs.map(
    (doc) => doc.data() as AnimalBreedFromStore
  );

  await prisma.breed.createMany({
    data: breeds.map((breed) => ({
      id: breed.id,
      name: breed.name.trim(),
      species: breed.species,
    })),
  });
}

type AnimalColorFromStore = {
  id: string;
  name: string;
};

async function migrateColors() {
  const snapshots = await getFirestore().collection("animalColors").get();

  const colors = snapshots.docs.map(
    (doc) => doc.data() as AnimalColorFromStore
  );

  await prisma.color.createMany({
    data: colors.map((color) => ({ id: color.id, name: color.name.trim() })),
  });
}

type EventFromStore = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image?: string | null;
  startDate: string;
  startDateTimestamp: number;
  endDate: string;
  endDateTimestamp: number;
  isFullDay: boolean;
  location: string;
  category: EventCategory;
  isVisible: boolean;
};

async function migrateEvents() {
  const snapshots = await getFirestore().collection("events").get();
  const events = snapshots.docs.map((doc) => doc.data() as EventFromStore);

  await prisma.event.createMany({
    data: events.map((event) => ({
      id: event.id,
      title: event.title.trim(),
      shortDescription: event.shortDescription.trim(),
      description: event.description.trim(),
      image: event.image,
      startDate: event.startDate,
      endDate: event.endDate,
      isFullDay: event.isFullDay,
      location: event.location.trim(),
      category: event.category,
      isVisible: event.isVisible,
    })),
  });
}

type AnimalFromStore = {
  id: string;
  officialName: string;
  commonName?: string | null;
  birthdate: string;
  birthdateTimestamp: number;
  gender: AnimalGender;
  species: AnimalSpecies;
  breedId?: string | null;
  colorId?: string | null;
  description?: string | null;
  avatarId: string;
  picturesId: string[];
  managerId?: string | null;
  pickUpDate: string;
  pickUpDateTimestamp: number;
  pickUpLocation?: string | null;
  pickUpReason: PickUpReason;
  status: AnimalStatus;
  adoptionDate?: string | null;
  adoptionDateTimestamp?: number | null;
  adoptionOption?: AdoptionOption | null;
  hostFamilyId?: string | null;
  iCadNumber?: string | null;
  comments?: string | null;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
};

async function migrateAnimals(userIdsMapping: Map<string, string>) {
  const snapshots = await getFirestore().collection("animals").get();
  const animals = snapshots.docs.map((doc) => doc.data() as AnimalFromStore);

  return await prisma.animal.createMany({
    data: animals.map<Prisma.AnimalCreateManyInput>((animal) => ({
      id: animal.id,
      name: animal.officialName.trim(),
      alias: animal.commonName?.trim() || null,
      birthdate: DateTime.fromISO(animal.birthdate).toISO(),
      gender: animal.gender,
      species: animal.species,
      breedId: animal.breedId,
      colorId: animal.colorId,
      description: animal.description?.trim() || null,
      avatar: animal.avatarId,
      pictures: animal.picturesId,
      pickUpDate: DateTime.fromISO(animal.pickUpDate).toISO(),
      pickUpLocation: animal.pickUpLocation?.trim() || null,
      pickUpReason: animal.pickUpReason,
      status: animal.status,
      adoptionDate:
        animal.adoptionDate == null
          ? null
          : DateTime.fromISO(animal.adoptionDate).toISO(),
      adoptionOption: animal.adoptionOption,
      managerId:
        animal.managerId == null ? null : userIdsMapping.get(animal.managerId),
      fosterFamilyId: animal.hostFamilyId,
      iCadNumber: animal.iCadNumber?.trim() || null,
      comments: animal.comments?.trim() || null,
      isOkChildren: trileanToBoolean(animal.isOkChildren),
      isOkDogs: trileanToBoolean(animal.isOkDogs),
      isOkCats: trileanToBoolean(animal.isOkCats),
      isSterilized: animal.isSterilized,
    })),
  });
}
