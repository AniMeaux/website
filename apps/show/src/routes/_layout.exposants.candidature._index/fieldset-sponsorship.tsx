import { ProseInlineAction } from "#core/actions/prose-inline-action";
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
        {CLIENT_ENV.SPONSORSHIP_URL == null ? (
          <p>
            Pour soutenir le Salon des Ani’Meaux et contribuer à son succès,
            devenez sponsor. Votre soutien financier nous aidera à créer un
            événement mémorable, avec des animations variées et des exposants de
            qualité, tout en promouvant le bien-être animal.
          </p>
        ) : (
          <p>
            Pour soutenir le Salon des Ani’Meaux et contribuer à son succès,
            consultez{" "}
            <ProseInlineAction asChild>
              <a href={CLIENT_ENV.SPONSORSHIP_URL}>notre document</a>
            </ProseInlineAction>{" "}
            détaillant toutes les informations nécessaires pour devenir sponsor.
            Votre soutien financier nous aidera à créer un événement mémorable,
            avec des animations variées et des exposants de qualité, tout en
            promouvant le bien-être animal.
          </p>
        )}
      </HelperCard.Root>

      <FieldSponsorshipCategory />
    </FormLayout.Section>
  );
}

function FieldSponsorshipCategory() {
  const { fieldsets } = useFieldsets();
  const field = fieldsets.sponsorshipCategory;
  const value = field.value as undefined | SponsorshipCategory.Enum;

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

      {field.errors == null && value != null ? (
        <FormLayout.Helper id={field.descriptionId}>
          {value === SponsorshipCategory.Enum.NO_SPONSORSHIP
            ? "En devenant sponsor vous avez plus de chance d’être exposant"
            : "En choisissant d’être sponsor vous vous engagez à payer"}
        </FormLayout.Helper>
      ) : null}
    </FormLayout.Field>
  );
}
