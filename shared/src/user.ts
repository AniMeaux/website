import { UserGroup } from "@prisma/client";
import intersection from "lodash.intersection";
import { OperationErrorResult } from "./operationError";

export { UserGroup };

export type UserBrief = {
  id: string;
  displayName: string;
  groups: UserGroup[];
  disabled: boolean;
};

export type User = {
  id: string;
  email: string;
  displayName: string;
  groups: UserGroup[];
  disabled: boolean;
  managedAnimals: ManagedAnimal[];
  lastActivity?: string;
};

export type ManagedAnimal = {
  id: string;
  avatarId: string;
  name: string;
};

export type UserOperations = {
  getUser: (params: { id: string }) => User;
  getAllUsers: () => UserBrief[];
  createUser: (params: {
    email: string;
    displayName: string;
    password: string;
    groups: UserGroup[];
  }) => User | OperationErrorResult<"already-exists">;
  updateUser: (params: {
    id: string;
    displayName: string;
    password: string;
    groups: UserGroup[];
  }) => User;
  toggleUserBlockedStatus: (params: { id: string }) => User;
  deleteUser: (params: { id: string }) => boolean;
};

export function hasGroups(user: { groups: UserGroup[] }, groups: UserGroup[]) {
  return intersection(user.groups, groups).length > 0;
}
