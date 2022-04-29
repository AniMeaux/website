import { OperationErrorResult } from "./operationError";
import { UserGroup } from "./user";

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string;
  groups: UserGroup[];
  disabled: boolean;
};

export type CurrentUserOperations = {
  getCurrentUser: () => CurrentUser | null;
  updateCurrentUserProfile: (params: { displayName: string }) => CurrentUser;
  updateCurrentUserPassword: (params: {
    password: string;
  }) => boolean | OperationErrorResult<"week-password">;
};
