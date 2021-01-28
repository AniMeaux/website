import intersection from "lodash.intersection";
import isEqual from "lodash.isequal";
import { sortByLabels } from "./enumUtils";

export enum UserGroup {
  ADMIN = "ADMIN",
  ANIMAL_MANAGER = "ANIMAL_MANAGER",
  BLOGGER = "BLOGGER",
  HEAD_OF_PARTNERSHIPS = "HEAD_OF_PARTNERSHIPS",
  VETERINARIAN = "VETERINARIAN",
}

export const UserGroupLabels: {
  [key in UserGroup]: string;
} = {
  [UserGroup.ADMIN]: "Administrateur",
  [UserGroup.ANIMAL_MANAGER]: "Sociables mais de loin",
  [UserGroup.BLOGGER]: "Redacteur",
  [UserGroup.HEAD_OF_PARTNERSHIPS]: "Partenariat",
  [UserGroup.VETERINARIAN]: "Vétérinaire",
};

export function sortGroupsByLabel(groups: UserGroup[]) {
  return sortByLabels(groups, UserGroupLabels);
}

export const USER_GROUPS_ALPHABETICAL_ORDER = sortGroupsByLabel(
  Object.values(UserGroup)
);

export type User = {
  id: string;
  email: string;
  displayName: string;
  groups: UserGroup[];
  disabled: boolean;
};

export function doesGroupsIntersect(
  groupsA: UserGroup[],
  groupsB: UserGroup[]
) {
  return intersection(groupsA, groupsB).length > 0;
}

export function haveSameGroups(groupsA: UserGroup[], groupsB: UserGroup[]) {
  return isEqual(sortGroupsByLabel(groupsA), sortGroupsByLabel(groupsB));
}

export type DBUserFromAuth = {
  id: string;
  email: string;
  displayName: string;
  disabled: boolean;
};

export type DBUserFromStore = {
  id: string;
  groups: UserGroup[];
};

export type UserFormPayload = {
  email: string;
  displayName: string;
  password: string;
  groups: UserGroup[];
};

export type CreateUserPayload = {
  email: string;
  displayName: string;
  password: string;
  groups: UserGroup[];
};

export type UpdateUserPayload = {
  id: string;
  displayName?: string;
  password?: string;
  groups?: UserGroup[];
};
