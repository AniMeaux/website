import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import {
  EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORY_TRANSLATION,
  PARTNERSHIP_CATEGORY_TRANSLATION,
  PartnershipCategoryDescription,
  SORTED_EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORIES,
  SORTED_PARTNERSHIP_CATEGORIES,
} from "#exhibitors/partnership/category";
import { getCollectionProps } from "@conform-to/react";
import type {
  ShowExhibitorApplicationOtherPartnershipCategory,
  ShowPartnershipCategory,
} from "@prisma/client";
import { FieldsetId, useFieldsets } from "./form";

export function FieldsetPartnership() {
  return (
    <FormLayout.Section id={FieldsetId.PARTNERSHIP}>
      <FormLayout.Title>Sponsor</FormLayout.Title>

      <HelperCard.Root color="paleBlue">
        <HelperCard.Title>
          Vous souhaitez soutenir le Salon des Ani’Meaux et contribuer à sa
          réussite ?
        </HelperCard.Title>

        <p>
          Devenez sponsor en apportant votre soutien financier à notre
          association organisatrice. Votre contribution nous permettra de
          proposer un événement encore plus exceptionnel, avec des animations
          variées, des exposants de qualité et des moments de partage
          inoubliables. En devenant sponsor, vous marquerez votre engagement en
          faveur du bien-être animal et bénéficierez d’une visibilité auprès
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
      <FormLayout.Label>Catégorie de sponsor</FormLayout.Label>

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

                <PartnershipCategoryDescription
                  category={category}
                  className="text-caption-lowercase-default"
                />
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
