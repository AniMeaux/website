import { AnimalOperations } from "./animal";
import { AnimalBreedOperations } from "./animalBreed";
import { AnimalColorOperations } from "./animalColor";
import { AnimalFamilyOperations } from "./animalFamilies";
import { CurrentUserOperations } from "./currentUser";
import { EventOperations } from "./event";
import { FosterFamilyOperations } from "./fosterFamily";
import { ImageOperations } from "./image";
import { OperationPaginationResult } from "./operationPagination";
import { UserOperations } from "./user";

export type AllOperations = CurrentUserOperations &
  UserOperations &
  AnimalColorOperations &
  AnimalBreedOperations &
  FosterFamilyOperations &
  AnimalOperations &
  AnimalFamilyOperations &
  ImageOperations &
  EventOperations;

export type AllOperationName = keyof AllOperations;

export type OperationParams<TName extends AllOperationName> = Parameters<
  AllOperations[TName]
>[0];

export type OperationResult<TName extends AllOperationName> = ReturnType<
  AllOperations[TName]
>;

type PickPaginatedOperation<TName> = TName extends AllOperationName
  ? OperationResult<TName> extends OperationPaginationResult<any>
    ? TName
    : never
  : never;

type OmitPaginatedOperation<TName> = TName extends AllOperationName
  ? OperationResult<TName> extends OperationPaginationResult<any>
    ? never
    : TName
  : never;

export type AllPaginatedOperationName =
  PickPaginatedOperation<AllOperationName>;

export type AllNonPaginatedOperationName =
  OmitPaginatedOperation<AllOperationName>;
