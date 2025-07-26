import {
  Markdown,
  PARAGRAPH_COMPONENTS,
  withoutNode,
} from "#core/data-display/markdown";
import { cn } from "@animeaux/core";
import {
  ShowExhibitorApplicationOtherSponsorshipCategory,
  ShowSponsorshipCategory,
} from "@prisma/client";

export const SPONSORSHIP_CATEGORY_TRANSLATION: Record<
  ShowSponsorshipCategory,
  string
> = {
  [ShowSponsorshipCategory.POLLEN]: "Pollen",
  [ShowSponsorshipCategory.BRONZE]: "Pott de bronze",
  [ShowSponsorshipCategory.SILVER]: "Pott d’argent",
  [ShowSponsorshipCategory.GOLD]: "Pott d’or",
};

export function SponsorshipCategoryDescription({
  category,
  className,
}: {
  category: ShowSponsorshipCategory;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1", className)}>
      <Markdown
        content={SPONSORSHIP_CATEGORY_DESCRIPTION[category]}
        components={{
          ...PARAGRAPH_COMPONENTS,

          strong: (props) => (
            <strong
              {...withoutNode(props)}
              // Only update the font-weight for a more flexible font-size.
              className="font-medium"
            />
          ),

          p: (props) => <p {...withoutNode(props)} />,

          ul: (props) => (
            <ul {...withoutNode(props)} className="list-disc pl-[16px]" />
          ),
        }}
      />
    </div>
  );
}

const SPONSORSHIP_CATEGORY_DESCRIPTION: Record<
  ShowSponsorshipCategory,
  string
> = {
  [ShowSponsorshipCategory.POLLEN]: `À partir de 100 € de don pour les stands de 6 m² et 9 m :

- -40 % sur le stand
- Visibilité digitale légère (site internet) - **mise en ligne au plus tard en avril 2025**.`,

  [ShowSponsorshipCategory.BRONZE]: `À partir de 200 € de don :

- Visibilité digitale (réseaux sociaux, site internet) - **mise en ligne au plus tard en avril 2025**.`,

  [ShowSponsorshipCategory.SILVER]: `À partir de 500 € de don :

- Visibilité digitale (réseaux sociaux, site internet) - **mise en ligne au plus tard en avril 2025**.
- Visibilité imprimée (flyer, affiche) - **impression courant avril 2025**.
- Stand offert.
- Flyer dans les gift bags - **à nous fournir au plus tard le vendredi 6 juin à 9h**.`,

  [ShowSponsorshipCategory.GOLD]: `À partir de 1 000 € de don :

- Visibilité digitale (réseaux sociaux, site internet) - **mise en ligne au plus tard en avril 2025**.
- Visibilité imprimée (flyer, affiche) - **impression courant avril 2025**.
- Stand offert.
- Flyer dans les gift bags - **à nous fournir au plus tard le vendredi 6 juin à 9h**.
- Visibilité sur les supports de l’association Ani’Meaux pendant 1 an.`,
};

export const SORTED_SPONSORSHIP_CATEGORIES = [
  ShowSponsorshipCategory.POLLEN,
  ShowSponsorshipCategory.BRONZE,
  ShowSponsorshipCategory.SILVER,
  ShowSponsorshipCategory.GOLD,
];

export const EXHIBITOR_APPLICATION_OTHER_SPONSORSHIP_CATEGORY_TRANSLATION: Record<
  ShowExhibitorApplicationOtherSponsorshipCategory,
  string
> = {
  [ShowExhibitorApplicationOtherSponsorshipCategory.MAYBE]:
    "J’aimerais étudier un peu plus la question",
  [ShowExhibitorApplicationOtherSponsorshipCategory.NO_SPONSORSHIP]:
    "Malheureusement ce n’est pas possible",
};

export const SORTED_EXHIBITOR_APPLICATION_OTHER_SPONSORSHIP_CATEGORIES = [
  ShowExhibitorApplicationOtherSponsorshipCategory.MAYBE,
  ShowExhibitorApplicationOtherSponsorshipCategory.NO_SPONSORSHIP,
];

export function isSponsorshipCategory(
  category:
    | ShowSponsorshipCategory
    | ShowExhibitorApplicationOtherSponsorshipCategory,
): category is ShowSponsorshipCategory {
  return SORTED_SPONSORSHIP_CATEGORIES.includes(category);
}
