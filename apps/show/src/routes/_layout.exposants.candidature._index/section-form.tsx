import { FormLayout } from "#core/layout/form-layout";
import { getFormProps } from "@conform-to/react";
import { Form, useFormAction, useNavigation } from "@remix-run/react";
import { FieldsetComments } from "./fieldset-comments";
import { FieldsetContact } from "./fieldset-contact";
import { FieldsetDocuments } from "./fieldset-documents";
import { FieldsetParticipation } from "./fieldset-participation";
import { FieldsetPartnership } from "./fieldset-partnership";
import { FieldsetStructure } from "./fieldset-structure";
import { FieldsetId, FieldsetsProvider, useForm } from "./form";

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
            <FieldsetDocuments />

            <FormLayout.SectionSeparator />

            <FieldsetContact />

            <FormLayout.SectionSeparator />

            <FieldsetStructure />

            <FormLayout.SectionSeparator />

            <FieldsetParticipation />

            <FormLayout.SectionSeparator />

            <FieldsetPartnership />

            <FormLayout.SectionSeparator />

            <FieldsetComments />

            <FormLayout.SectionSeparator />

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
            sectionId={FieldsetId.DOCUMENTS}
            isComplete={
              fieldsets.documents.valid &&
              fieldsets.documents.value?.acceptInnerRegulation === "on" &&
              fieldsets.documents.value?.acceptCharterAndHealthRegulation ===
                "on"
            }
          >
            Documents
          </FormLayout.NavItem>

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
              fieldsets.structure.value?.haveCivilLiability === "on" &&
              fieldsets.structure.value?.activityDescription != null &&
              fieldsets.structure.value?.activityTargets != null &&
              fieldsets.structure.value?.activityFields != null &&
              fieldsets.structure.value?.logo != null
            }
          >
            Structure
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
            Sponsor
          </FormLayout.NavItem>

          <FormLayout.NavItem
            sectionId={FieldsetId.COMMENTS}
            isComplete={
              fieldsets.comments.valid &&
              fieldsets.comments.value?.motivation != null &&
              fieldsets.comments.value?.discoverySource != null
            }
          >
            Commentaires
          </FormLayout.NavItem>
        </FormLayout.Nav>
      </FormLayout.Root>
    </FieldsetsProvider>
  );
}
