import intersection from "lodash.intersection";
import { OperationErrorResult } from "./operationError";

export enum UserGroup {
  ADMIN = "ADMIN",
  ANIMAL_MANAGER = "ANIMAL_MANAGER",
  BLOGGER = "BLOGGER",
  HEAD_OF_PARTNERSHIPS = "HEAD_OF_PARTNERSHIPS",
  VETERINARIAN = "VETERINARIAN",
}

export type User = {
  id: string;
  email: string;
  displayName: string;
  groups: UserGroup[];
  disabled: boolean;
};

export type UserOperations = {
  getUser: (params: { id: string }) => User;
  getAllUsers: () => User[];
  createUser: (params: {
    email: string;
    displayName: string;
    password: string;
    groups: UserGroup[];
  }) => User | OperationErrorResult<"week-password" | "email-already-exists">;
  updateUser: (params: {
    id: string;
    displayName: string;
    password: string;
    groups: UserGroup[];
  }) => User | OperationErrorResult<"week-password">;
  toggleUserBlockedStatus: (params: { id: string }) => User;
  deleteUser: (params: { id: string }) => boolean;
};

export function doesGroupsIntersect(
  groupsA: UserGroup[],
  groupsB: UserGroup[]
) {
  return intersection(groupsA, groupsB).length > 0;
}
