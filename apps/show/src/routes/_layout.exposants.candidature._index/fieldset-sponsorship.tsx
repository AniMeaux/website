import { FieldErrorHelper } from "#core/form-elements/field-error-helper";
import { FormLayout } from "#core/layout/form-layout";
import { HelperCard } from "#core/layout/helper-card";
import { SponsorshipCategory } from "#exhibitors/sponsorship/category";
import { getCollectionProps } from "@conform-to/react";
import { FieldsetId, useFieldsets } from "./form";

export function FieldsetSponsorship() {
  return (
    <FormLayout.Section id={FieldsetId.SPONSORSHIP}>
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

      <FieldSponsorshipCategory />
    </FormLayout.Section>
  );
}

function FieldSponsorshipCategory() {
  const { fieldsets } = useFieldsets();
  const field = fieldsets.sponsorshipCategory;

  return (
    <FormLayout.Field>
      <FormLayout.Label>Catégorie</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="100%">
        {getCollectionProps(field, {
          type: "radio",
          options: SponsorshipCategory.values,
        }).map((props) => {
          const category = props.value as SponsorshipCategory.Enum;

          return (
            <FormLayout.Selector.Root key={props.key}>
              <FormLayout.Selector.Input {...props} key={props.key} />

              <FormLayout.Selector.Label className="grid grid-cols-1 gap-1">
                {SponsorshipCategory.translation[category]}
              </FormLayout.Selector.Label>

              <FormLayout.Selector.RadioIcon />
            </FormLayout.Selector.Root>
          );
        })}
      </FormLayout.Selectors>

      <FieldErrorHelper field={field} />
    </FormLayout.Field>
  );
}
