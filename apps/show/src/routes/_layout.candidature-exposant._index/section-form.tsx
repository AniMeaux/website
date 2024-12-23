import { FieldEmail } from "#core/form-elements/field-email";
import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FieldNumeric } from "#core/form-elements/field-numeric";
import { FieldPhone } from "#core/form-elements/field-phone";
import { FieldSwitch } from "#core/form-elements/field-switch";
import { FieldText } from "#core/form-elements/field-text";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FieldUrl } from "#core/form-elements/field-url";
import { InputFileImage } from "#core/form-elements/input-file-image";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { Icon } from "#generated/icon";
import { createStrictContext } from "@animeaux/core";
import {
  getCollectionProps,
  getFormProps,
  getInputProps,
  useForm as useFormBase,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import type {
  ShowActivityField,
  ShowActivityTarget,
  ShowExhibitorApplicationLegalStatus,
  ShowExhibitorApplicationOtherPartnershipCategory,
  ShowPartnershipCategory,
  ShowStandSize,
} from "@prisma/client";
import {
  Form,
  useActionData,
  useFormAction,
  useNavigation,
} from "@remix-run/react";
import { ActionSchema } from "./action";
import {
  ACTIVITY_FIELD_ICON,
  ACTIVITY_FIELD_TRANSLATION,
  SMALL_SIZED_STANDS_ACTIVITY_FIELDS,
  SORTED_ACTIVITY_FIELDS,
} from "./activity-field";
import {
  ACTIVITY_TARGET_ICON,
  ACTIVITY_TARGET_TRANSLATION,
  SORTED_ACTIVITY_TARGETS,
} from "./activity-target";
import {
  LEGAL_STATUS_TRANSLATION,
  OTHER_SHOW_LEGAL_STATUS,
  SORTED_LEGAL_STATUS,
} from "./legal-status";
import {
  EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORY_TRANSLATION,
  PARTNERSHIP_CATEGORY_DESCRIPTION,
  PARTNERSHIP_CATEGORY_TRANSLATION,
  SORTED_EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORIES,
  SORTED_PARTNERSHIP_CATEGORIES,
} from "./partnership-category";
import type { action } from "./route";
import {
  SORTED_STAND_SIZES,
  STAND_SIZE_TRANSLATION,
  isLargeStandSize,
} from "./stand-size";

export function SectionForm() {
  const formAction = useFormAction();
  const navigation = useNavigation();
  const [form, fieldsets] = useForm();

  return (
    <FieldsetsProvider fieldsets={fieldsets}>
      <FormLayout.Root className="py-4 px-safe-page-narrow md:px-safe-page-normal">
        <FormLayout.Form asChild>
          <Form
            {...getFormProps(form)}
            method="POST"
            encType="multipart/form-data"
          >
            <FieldsetContact />

            <FormLayout.Separator />

            <FieldsetStructure />

            <FormLayout.Separator />

            <FieldsetBilling />

            <FormLayout.Separator />

            <FieldsetParticipation />

            <FormLayout.Separator />

            <FieldsetPartnership />

            <FormLayout.Separator />

            <FieldsetDiscoverySource />

            <FormLayout.Separator />

            <FormLayout.Action
              isLoading={
                navigation.state !== "idle" &&
                navigation.formAction === formAction
              }
            >
              Envoyer
            </FormLayout.Action>
          </Form>
        </FormLayout.Form>

        <FormLayout.Nav>
          <FormLayout.NavItem
            sectionId={FieldsetId.CONTACT}
            isComplete={
              fieldsets.contact.valid &&
              fieldsets.contact.value?.email != null &&
              fieldsets.contact.value?.firstname != null &&
              fieldsets.contact.value?.lastname != null &&
              fieldsets.contact.value?.phone != null
            }
          >
            Contact
          </FormLayout.NavItem>

          <FormLayout.NavItem
            sectionId={FieldsetId.STRUCTURE}
            isComplete={
              fieldsets.structure.valid &&
              fieldsets.structure.value?.name != null &&
              fieldsets.structure.value?.url != null &&
              fieldsets.structure.value?.legalStatus != null &&
              fieldsets.structure.value?.siret != null &&
              fieldsets.structure.value?.address != null &&
              fieldsets.structure.value?.zipCode != null &&
              fieldsets.structure.value?.city != null &&
              fieldsets.structure.value?.country != null &&
              fieldsets.structure.value?.activityTargets != null &&
              fieldsets.structure.value?.activityFields != null &&
              fieldsets.structure.value?.logo != null
            }
          >
            Structure
          </FormLayout.NavItem>

          <FormLayout.NavItem
            sectionId={FieldsetId.BILLING}
            isComplete={
              fieldsets.billing.valid &&
              (fieldsets.billing.value?.sameAsStructure === "on" ||
                (fieldsets.billing.value?.address != null &&
                  fieldsets.billing.value?.zipCode != null &&
                  fieldsets.billing.value?.city != null &&
                  fieldsets.billing.value?.country != null))
            }
          >
            Facturation
          </FormLayout.NavItem>

          <FormLayout.NavItem
            sectionId={FieldsetId.PARTICIPATION}
            isComplete={
              fieldsets.participation.valid &&
              fieldsets.participation.value?.desiredStandSize != null
            }
          >
            Participation
          </FormLayout.NavItem>

          <FormLayout.NavItem
            sectionId={FieldsetId.PARTNERSHIP}
            isComplete={
              fieldsets.partnershipCategory.valid &&
              fieldsets.partnershipCategory.value != null
            }
          >
            Partenariat
          </FormLayout.NavItem>

          <FormLayout.NavItem
            sectionId={FieldsetId.DISCOVERY_SOURCE}
            isComplete={
              fieldsets.discoverySource.valid &&
              fieldsets.discoverySource.value != null
            }
          >
            Source
          </FormLayout.NavItem>
        </FormLayout.Nav>
      </FormLayout.Root>
    </FieldsetsProvider>
  );
}

function useForm() {
  const actionData = useActionData<typeof action>();

  return useFormBase({
    id: "exhibitor-application",
    constraint: getZodConstraint(ActionSchema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    defaultValue: { billing: { sameAsStructure: "on" } },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: ActionSchema }),
  });
}

type Fieldsets = ReturnType<typeof useForm>[1];

const [FieldsetsProvider, useFieldsets] = createStrictContext<{
  fieldsets: Fieldsets;
}>();

const FieldsetId = {
  CONTACT: "contact",
  STRUCTURE: "structure",
  BILLING: "billing",
  PARTICIPATION: "participation",
  PARTNERSHIP: "partnership",
  DISCOVERY_SOURCE: "discovery-source",
} as const;

function FieldsetContact() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.contact.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.CONTACT}>
      <FormLayout.Title>Contact</FormLayout.Title>

      <FormLayout.Row>
        <FieldText label="Nom" field={fieldset.lastname} />
        <FieldText label="Prénom" field={fieldset.firstname} />
      </FormLayout.Row>

      <FieldEmail label="Adresse email" field={fieldset.email} />
      <FieldPhone label="Numéro de téléphone" field={fieldset.phone} />
    </FormLayout.Section>
  );
}

function FieldsetStructure() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.structure.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.STRUCTURE}>
      <FormLayout.Title>Structure</FormLayout.Title>

      <FieldText label="Nom" field={fieldset.name} />

      <FieldUrl
        label="Lien du site internet ou réseau social"
        field={fieldset.url}
      />

      <FieldLegalStatus />

      {fieldset.legalStatus.value === OTHER_SHOW_LEGAL_STATUS ? (
        <FieldText
          label="Précisez la forme juridique"
          field={fieldset.otherLegalStatus}
        />
      ) : null}

      <FieldText
        label="Numéro de SIRET ou tout autre numéro d’identification de la structure"
        field={fieldset.siret}
      />

      <FieldText label="Adresse de domiciliation" field={fieldset.address} />

      <FormLayout.Row>
        <FieldNumeric label="Code postal" field={fieldset.zipCode} />
        <FieldText label="Ville" field={fieldset.city} />
        <FieldText label="Pays" field={fieldset.country} />
      </FormLayout.Row>

      <FieldActivityTarget />
      <FieldActivityField />

      <FieldLogo />
    </FormLayout.Section>
  );
}

function FieldLegalStatus() {
  const { fieldsets } = useFieldsets();
  const field = fieldsets.structure.getFieldset().legalStatus;

  return (
    <FormLayout.Field>
      <FormLayout.Label asChild>
        <p>Forme juridique</p>
      </FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="250px">
        {getCollectionProps(field, {
          type: "radio",
          options: [...SORTED_LEGAL_STATUS, OTHER_SHOW_LEGAL_STATUS],
        }).map((props) => (
          <FormLayout.Selector.Root key={props.key}>
            <FormLayout.Selector.Input {...props} key={props.key} />

            <FormLayout.Selector.Label>
              {
                LEGAL_STATUS_TRANSLATION[
                  props.value as
                    | ShowExhibitorApplicationLegalStatus
                    | typeof OTHER_SHOW_LEGAL_STATUS
                ]
              }
            </FormLayout.Selector.Label>

            <FormLayout.Selector.RadioIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}

function FieldActivityTarget() {
  const { fieldsets } = useFieldsets();
  const field = fieldsets.structure.getFieldset().activityTargets;

  return (
    <FormLayout.Field>
      <FormLayout.Label asChild>
        <p>Cibles</p>
      </FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="250px">
        {getCollectionProps(field, {
          type: "checkbox",
          options: SORTED_ACTIVITY_TARGETS,
        }).map((props) => {
          const activityTarget = props.value as ShowActivityTarget;

          return (
            <FormLayout.Selector.Root key={props.key}>
              <FormLayout.Selector.Input {...props} key={props.key} />

              <FormLayout.Selector.CheckedIcon asChild>
                <Icon id={ACTIVITY_TARGET_ICON[activityTarget].solid} />
              </FormLayout.Selector.CheckedIcon>

              <FormLayout.Selector.UncheckedIcon asChild>
                <Icon id={ACTIVITY_TARGET_ICON[activityTarget].light} />
              </FormLayout.Selector.UncheckedIcon>

              <FormLayout.Selector.Label>
                {ACTIVITY_TARGET_TRANSLATION[activityTarget]}
              </FormLayout.Selector.Label>

              <FormLayout.Selector.CheckboxIcon />
            </FormLayout.Selector.Root>
          );
        })}
      </FormLayout.Selectors>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}

function FieldActivityField() {
  const { fieldsets } = useFieldsets();
  const field = fieldsets.structure.getFieldset().activityFields;

  return (
    <FormLayout.Field>
      <FormLayout.Label asChild>
        <p>Domaines d’activités</p>
      </FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="250px">
        {getCollectionProps(field, {
          type: "checkbox",
          options: SORTED_ACTIVITY_FIELDS,
        }).map((props) => {
          const activityField = props.value as ShowActivityField;

          return (
            <FormLayout.Selector.Root key={props.key}>
              <FormLayout.Selector.Input {...props} key={props.key} />

              <FormLayout.Selector.CheckedIcon asChild>
                <Icon id={ACTIVITY_FIELD_ICON[activityField].solid} />
              </FormLayout.Selector.CheckedIcon>

              <FormLayout.Selector.UncheckedIcon asChild>
                <Icon id={ACTIVITY_FIELD_ICON[activityField].light} />
              </FormLayout.Selector.UncheckedIcon>

              <FormLayout.Selector.Label>
                {ACTIVITY_FIELD_TRANSLATION[activityField]}
              </FormLayout.Selector.Label>

              <FormLayout.Selector.CheckboxIcon />
            </FormLayout.Selector.Root>
          );
        })}
      </FormLayout.Selectors>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}

function FieldLogo() {
  const { fieldsets } = useFieldsets();
  const field = fieldsets.structure.getFieldset().logo;

  return (
    <FormLayout.Field>
      <FormLayout.Label htmlFor={field.id}>Logo</FormLayout.Label>

      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:items-start">
        <InputFileImage.Root>
          <InputFileImage.Input
            {...getInputProps(field, { type: "file" })}
            accept="image/*"
          />

          <InputFileImage.Preview alt={field.value?.name} />
          <InputFileImage.Placeholder />
        </InputFileImage.Root>

        <FormLayout.Helper className="md:px-1">
          Recommendations pour votre logo :
          <br />
          - De bonne qualité (&gt;= 1024 x 768)
          <br />
          - Sur fond blanc ou transparent
          <br />- Format 4:3
        </FormLayout.Helper>
      </div>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}

function FieldsetBilling() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.billing.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.BILLING}>
      <FormLayout.Title>Facturation</FormLayout.Title>

      <FieldSwitch
        label="Utiliser l’adresse de domiciliation pour la facturation"
        field={fieldset.sameAsStructure}
      />

      {fieldset.sameAsStructure.value !== "on" ? (
        <FieldText label="Adresse de facturation" field={fieldset.address} />
      ) : null}

      {fieldset.sameAsStructure.value !== "on" ? (
        <FormLayout.Row>
          <FieldNumeric label="Code postal" field={fieldset.zipCode} />
          <FieldText label="Ville" field={fieldset.city} />
          <FieldText label="Pays" field={fieldset.country} />
        </FormLayout.Row>
      ) : null}
    </FormLayout.Section>
  );
}

function FieldsetParticipation() {
  const { fieldsets } = useFieldsets();
  const fieldset = fieldsets.participation.getFieldset();

  return (
    <FormLayout.Section id={FieldsetId.PARTICIPATION}>
      <FormLayout.Title>Participation</FormLayout.Title>

      <FieldStandSize />

      <FieldTextarea
        label="Aimeriez-vous proposer une animation sur scène dans le cadre de la
        sensibilisation au bien-être animal ? Si oui, merci de préciser
        ci-dessous."
        field={fieldset.proposalForOnStageEntertainment}
        rows={3}
      />
    </FormLayout.Section>
  );
}

function FieldStandSize() {
  const { fieldsets } = useFieldsets();
  const field = fieldsets.participation.getFieldset().desiredStandSize;

  const activityFieldsFieldValue = fieldsets.structure.getFieldset()
    .activityFields.value as
    | undefined
    | ShowActivityField
    | ShowActivityField[];

  const selectedActivityFields =
    activityFieldsFieldValue == null
      ? []
      : Array.isArray(activityFieldsFieldValue)
        ? activityFieldsFieldValue
        : [activityFieldsFieldValue];

  const hasLimitedStandSize = selectedActivityFields.some(
    (selectedActivityField) =>
      SMALL_SIZED_STANDS_ACTIVITY_FIELDS.includes(selectedActivityField),
  );

  let options = SORTED_STAND_SIZES;

  if (hasLimitedStandSize) {
    options = SORTED_STAND_SIZES.filter(
      (standSize) => !isLargeStandSize(standSize),
    );
  }

  return (
    <FormLayout.Field>
      <FormLayout.Label asChild>
        <p>Taille du stand souhaité</p>
      </FormLayout.Label>

      <FormLayout.Selectors
        columnMinWidth={options.length > 2 ? "170px" : "250px"}
      >
        {getCollectionProps(field, { type: "radio", options }).map((props) => (
          <FormLayout.Selector.Root key={props.key}>
            <FormLayout.Selector.Input {...props} key={props.key} />

            <FormLayout.Selector.Label>
              {STAND_SIZE_TRANSLATION[props.value as ShowStandSize]}
            </FormLayout.Selector.Label>

            <FormLayout.Selector.RadioIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>

      {field.errors == null ? (
        <FieldErrorHelper field={field} />
      ) : (
        <FormLayout.Helper>Sous réserve de disponibilité</FormLayout.Helper>
      )}
    </FormLayout.Field>
  );
}

function FieldsetPartnership() {
  return (
    <FormLayout.Section id={FieldsetId.PARTNERSHIP}>
      <FormLayout.Title>Partenariat</FormLayout.Title>

      <HelperCard.Root>
        <HelperCard.Title>
          Vous souhaitez soutenir le Salon des Ani’Meaux et contribuer à sa
          réussite ?
        </HelperCard.Title>

        <p>
          Devenez partenaire en apportant votre soutien financier à notre
          association organisatrice. Votre contribution nous permettra de
          proposer un événement encore plus exceptionnel, avec des animations
          variées, des exposants de qualité et des moments de partage
          inoubliables. En devenant partenaire, vous marquerez votre engagement
          en faveur du bien-être animal et bénéficierez d’une visibilité auprès
          d’un large public passionné.
        </p>
      </HelperCard.Root>

      <FieldPartnershipCategory />
    </FormLayout.Section>
  );
}

function FieldPartnershipCategory() {
  const { fieldsets } = useFieldsets();
  const field = fieldsets.partnershipCategory;

  return (
    <FormLayout.Field>
      <FormLayout.Label asChild>
        <p>Catégorie de partenariat</p>
      </FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="100%">
        {getCollectionProps(field, {
          type: "radio",
          options: SORTED_PARTNERSHIP_CATEGORIES,
        }).map((props) => {
          const category = props.value as ShowPartnershipCategory;

          return (
            <FormLayout.Selector.Root key={props.key}>
              <FormLayout.Selector.Input {...props} key={props.key} />

              <FormLayout.Selector.Label className="grid grid-cols-1 gap-1">
                <strong className="text-body-lowercase-emphasis">
                  {PARTNERSHIP_CATEGORY_TRANSLATION[category]}
                </strong>

                <p className="whitespace-pre-wrap">
                  {PARTNERSHIP_CATEGORY_DESCRIPTION[category]}
                </p>
              </FormLayout.Selector.Label>

              <FormLayout.Selector.RadioIcon />
            </FormLayout.Selector.Root>
          );
        })}

        {getCollectionProps(field, {
          type: "radio",
          options: SORTED_EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORIES,
        }).map((props) => (
          <FormLayout.Selector.Root key={props.key}>
            <FormLayout.Selector.Input {...props} key={props.key} />

            <FormLayout.Selector.Label>
              {
                EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORY_TRANSLATION[
                  props.value as ShowExhibitorApplicationOtherPartnershipCategory
                ]
              }
            </FormLayout.Selector.Label>

            <FormLayout.Selector.RadioIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}

function FieldsetDiscoverySource() {
  const { fieldsets } = useFieldsets();

  return (
    <FormLayout.Section id={FieldsetId.DISCOVERY_SOURCE}>
      <FormLayout.Title>Source</FormLayout.Title>

      <FieldText
        label="Comment avez-vous connus le salon ?"
        field={fieldsets.discoverySource}
      />
    </FormLayout.Section>
  );
}
