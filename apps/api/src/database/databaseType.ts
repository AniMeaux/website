import {
  AnimalBreed,
  AnimalBreedSearch,
  AnimalSearch,
  CreateAnimalBreedPayload,
  CreateAnimalPayload,
  CreateHostFamilyPayload,
  CreateUserPayload,
  DBAnimal,
  DBSearchableAnimal,
  HostFamily,
  HostFamilySearch,
  PaginatedRequestParameters,
  PaginatedResponse,
  UpdateAnimalBreedPayload,
  UpdateAnimalPayload,
  UpdateHostFamilyPayload,
  UpdateUserPayload,
  User,
} from "@animeaux/shared-entities";

export type DatabaseCore = {
  initialize(): void;
};

export type UserDatabase = {
  getUserForQueryContext(token: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | null>;
  createUser(payload: CreateUserPayload): Promise<User>;
  updateUser(currentUser: User, payload: UpdateUserPayload): Promise<User>;
  deleteUser(currentUser: User, id: string): Promise<boolean>;
  toggleUserBlockedStatus(currentUser: User, id: string): Promise<User>;
};

export type AnimalBreedDatabase = {
  getAllAnimalBreeds(
    parameters: PaginatedRequestParameters<AnimalBreedSearch>
  ): Promise<PaginatedResponse<AnimalBreed>>;
  getAnimalBreed(id: string): Promise<AnimalBreed | null>;
  createAnimalBreed(payload: CreateAnimalBreedPayload): Promise<AnimalBreed>;
  updateAnimalBreed(payload: UpdateAnimalBreedPayload): Promise<AnimalBreed>;
  deleteAnimalBreed(id: string): Promise<boolean>;
};

export type HostFamilyDatabase = {
  getAllHostFamilies(
    parameters: PaginatedRequestParameters<HostFamilySearch>
  ): Promise<PaginatedResponse<HostFamily>>;
  getHostFamily(id: string): Promise<HostFamily | null>;
  createHostFamily(payload: CreateHostFamilyPayload): Promise<HostFamily>;
  updateHostFamily(payload: UpdateHostFamilyPayload): Promise<HostFamily>;
  deleteHostFamily(id: string): Promise<boolean>;
};

export type AnimalDatabase = {
  getAllAnimals(
    parameters: PaginatedRequestParameters<AnimalSearch>
  ): Promise<PaginatedResponse<DBSearchableAnimal>>;
  getAllActiveAnimals(
    parameters: PaginatedRequestParameters
  ): Promise<PaginatedResponse<DBSearchableAnimal>>;
  getAnimal(id: string): Promise<DBAnimal | null>;
  createAnimal(payload: CreateAnimalPayload): Promise<DBAnimal>;
  updateAnimal(payload: UpdateAnimalPayload): Promise<DBAnimal>;
  deleteAnimal(id: string): Promise<boolean>;
};

export type Database = DatabaseCore &
  UserDatabase &
  AnimalBreedDatabase &
  HostFamilyDatabase &
  AnimalDatabase;
