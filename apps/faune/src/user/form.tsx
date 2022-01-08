import {
  OperationResult,
  PickOperationErrorResult,
  User,
  UserGroup,
} from "@animeaux/shared";
import { useCurrentUser } from "account/currentUser";
import { Info } from "core/dataDisplay/info";
import { Adornment } from "core/formElements/adornment";
import { Field, Fields } from "core/formElements/field";
import { FieldMessage } from "core/formElements/fieldMessage";
import { Form } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import { PasswordInput } from "core/formElements/passwordInput";
import {
  Selector,
  SelectorCheckbox,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  Selectors,
} from "core/formElements/selector";
import { SubmitButton } from "core/formElements/submitButton";
import { BaseValidationError } from "core/formValidation";
import { includes } from "core/includes";
import { joinReactNodes } from "core/joinReactNodes";
import { Separator } from "core/layouts/separator";
import { Placeholder, Placeholders } from "core/loaders/placeholder";
import { SetStateAction } from "core/types";
import invariant from "invariant";
import without from "lodash.without";
import { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { UserGroupIcon } from "user/group/icon";
import { USER_GROUP_LABELS } from "user/group/labels";
import { string } from "yup";

type ErrorCode =
  | PickOperationErrorResult<
      OperationResult<"createUser" | "updateUser">
    >["code"]
  | "server-error"
  | "empty-display-name"
  | "empty-email"
  | "invalid-email"
  | "empty-password"
  | "week-password"
  | "empty-groups"
  | "cannot-remove-admin-group";

class ValidationError extends BaseValidationError<ErrorCode> {}

const ERROR_CODE_LABEL: Record<ErrorCode, string> = {
  "server-error": "Une erreur est survenue.",
  "empty-display-name": "Le nom est obligatoire.",
  "empty-email": "L'email est obligatoire.",
  "invalid-email": "Le format de l'email est invalide.",
  "email-already-exists": "L'email est déjà utilisé.",
  "empty-password": "Le mot de passe doit avoir au moins 6 caractères.",
  "week-password": "Le mot de passe doit avoir au moins 6 caractères.",
  "empty-groups": "L'utilisateur doit avoir au moins 1 groupe.",
  "cannot-remove-admin-group":
    "Vous ne pouvez pas vous retirer du group Administrateur.",
};

type FormState = {
  displayName: string;
  email: string;
  password: string;
  groups: UserGroup[];
  errors: ErrorCode[];
};

type FormValue = Omit<FormState, "errors">;

type UserFormProps = {
  initialUser?: User;
  pending: boolean;
  onSubmit: (value: FormValue) => void;
  serverErrors: ErrorCode[];
};

export function UserForm({
  initialUser,
  onSubmit,
  pending,
  serverErrors,
}: UserFormProps) {
  const { currentUser } = useCurrentUser();
  const isEdit = initialUser != null;
  const [state, setState] = useState(initializeState(initialUser));

  async function handleSubmit() {
    if (!pending) {
      try {
        onSubmit(validate(state, isEdit, currentUser.id === initialUser?.id));
      } catch (error) {
        invariant(
          error instanceof ValidationError,
          "The error is expected to be a ValidationError error"
        );

        setState(setErrors(error.codes));
      }
    }
  }

  const errors = [...serverErrors, ...state.errors];

  return (
    <Form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <Info variant="error">
          {joinReactNodes(
            errors.map((error) => ERROR_CODE_LABEL[error]),
            <br />
          )}
        </Info>
      )}

      <Fields>
        <Field>
          <Label
            htmlFor="name"
            hasError={includes(errors, "empty-display-name")}
          >
            Nom
          </Label>

          <Input
            name="name"
            id="name"
            type="text"
            value={state.displayName}
            onChange={(displayName) => setState(setDisplayName(displayName))}
            placeholder="Jean"
            hasError={includes(errors, "empty-display-name")}
            leftAdornment={
              <Adornment>
                <FaUser />
              </Adornment>
            }
          />

          <FieldMessage
            infoMessage={
              isEdit
                ? "6 caractères minumum ; laisser vide pour ne pas changer"
                : "6 caractères minumum"
            }
          />
        </Field>

        <Field>
          <Label
            htmlFor="email"
            hasError={includes(
              errors,
              "empty-email",
              "invalid-email",
              "email-already-exists"
            )}
          >
            Email
          </Label>

          <Input
            name="email"
            id="email"
            type="email"
            // The email cannot be updated.
            disabled={isEdit}
            value={state.email}
            onChange={(email) => setState(setEmail(email))}
            placeholder="jean@mail.fr"
            hasError={includes(
              errors,
              "empty-email",
              "invalid-email",
              "email-already-exists"
            )}
            leftAdornment={
              <Adornment>
                <FaEnvelope />
              </Adornment>
            }
          />

          <FieldMessage
            infoMessage={
              isEdit
                ? "L'email ne peut pas être changé"
                : "L'email ne pourra pas être changé plus tard"
            }
          />
        </Field>

        <Field>
          <Label
            htmlFor="password"
            hasError={includes(errors, "empty-password", "week-password")}
          >
            Mot de passe
          </Label>

          <PasswordInput
            name="password"
            id="password"
            value={state.password}
            onChange={(password) => setState(setPassword(password))}
            hasError={includes(errors, "empty-password", "week-password")}
            leftAdornment={
              <Adornment>
                <FaLock />
              </Adornment>
            }
          />

          <FieldMessage
            infoMessage={
              isEdit
                ? "6 caractères minumum ; laisser vide pour ne pas changer"
                : "6 caractères minumum"
            }
          />
        </Field>

        <Separator />

        <Field>
          <Label
            hasError={includes(
              errors,
              "empty-groups",
              "cannot-remove-admin-group"
            )}
          >
            Groupes
          </Label>

          <Selectors>
            {Object.values(UserGroup).map((group) => (
              <SelectorItem key={group}>
                <Selector
                  hasError={includes(
                    errors,
                    "empty-groups",
                    "cannot-remove-admin-group"
                  )}
                >
                  <SelectorCheckbox
                    name="groups"
                    checked={state.groups.includes(group)}
                    onChange={() => setState(toggleGroup(group))}
                  />

                  <SelectorIcon>
                    <UserGroupIcon userGroup={group} />
                  </SelectorIcon>

                  <SelectorLabel>{USER_GROUP_LABELS[group]}</SelectorLabel>
                </Selector>
              </SelectorItem>
            ))}
          </Selectors>
        </Field>
      </Fields>

      <SubmitButton loading={pending}>
        {isEdit ? "Modifier" : "Créer"}
      </SubmitButton>
    </Form>
  );
}

function initializeState(initialUser?: User) {
  return (): FormState => ({
    displayName: initialUser?.displayName ?? "",
    email: initialUser?.email ?? "",
    password: "",
    groups: initialUser?.groups ?? [],
    errors: [],
  });
}

function setDisplayName(displayName: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    displayName,
    errors: without(prevState.errors, "empty-display-name"),
  });
}

function setEmail(email: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    email,
    errors: without(prevState.errors, "empty-email", "invalid-email"),
  });
}

function setPassword(password: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    password,
    errors: without(prevState.errors, "empty-password", "week-password"),
  });
}

function toggleGroup(group: UserGroup): SetStateAction<FormState> {
  return (prevState) => {
    let groups = prevState.groups.filter((g) => g !== group);
    if (groups.length === prevState.groups.length) {
      groups = groups.concat([group]);
    }

    return {
      ...prevState,
      groups,
      errors: without(prevState.errors, "empty-groups"),
    };
  };
}

function setErrors(errors: ErrorCode[]): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, errors });
}

function validate(
  state: FormState,
  isEdit: boolean,
  isCurrentUser: boolean
): FormValue {
  const errorCodes: ErrorCode[] = [];

  if (!string().trim().required().isValidSync(state.displayName)) {
    errorCodes.push("empty-display-name");
  }

  if (!string().trim().required().isValidSync(state.email)) {
    errorCodes.push("empty-email");
  } else if (!string().trim().email().isValidSync(state.email)) {
    errorCodes.push("invalid-email");
  }

  if (!isEdit) {
    if (!string().required().isValidSync(state.password)) {
      errorCodes.push("empty-password");
    } else if (!string().min(6).isValidSync(state.password)) {
      errorCodes.push("week-password");
    }
  }

  if (state.groups.length === 0) {
    errorCodes.push("empty-groups");
  }
  // Don't allow an admin (only admins can access users) to lock himself out.
  else if (isCurrentUser && !state.groups.includes(UserGroup.ADMIN)) {
    errorCodes.push("cannot-remove-admin-group");
  }

  if (errorCodes.length > 0) {
    throw new ValidationError(errorCodes);
  }

  return {
    displayName: state.displayName,
    email: state.email,
    password: state.password,
    groups: state.groups,
  };
}

export function UserFormPlaceholder() {
  return (
    <Form>
      <Fields>
        <Placeholders count={3}>
          <Field>
            <Label>
              <Placeholder $preset="label" />
            </Label>

            <Placeholder $preset="input" />
          </Field>
        </Placeholders>

        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Selectors>
            <Placeholders count={Object.values(UserGroup).length}>
              <SelectorItem>
                <Placeholder $preset="selector" />
              </SelectorItem>
            </Placeholders>
          </Selectors>
        </Field>
      </Fields>
    </Form>
  );
}
