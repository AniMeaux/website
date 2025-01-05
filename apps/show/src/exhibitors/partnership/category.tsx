import {
  Markdown,
  PARAGRAPH_COMPONENTS,
  withoutNode,
} from "#core/data-display/markdown";
import { cn } from "@animeaux/core";
import {
  ShowExhibitorApplicationOtherPartnershipCategory,
  ShowPartnershipCategory,
} from "@prisma/client";

export const PARTNERSHIP_CATEGORY_TRANSLATION: Record<
  ShowPartnershipCategory,
  string
> = {
  [ShowPartnershipCategory.BRONZE]: "Pott de bronze",
  [ShowPartnershipCategory.SILVER]: "Pott d’argent",
  [ShowPartnershipCategory.GOLD]: "Pott d’or",
};

export function PartnershipCategoryDescription({
  category,
  className,
}: {
  category: ShowPartnershipCategory;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1", className)}>
      <Markdown
        content={PARTNERSHIP_CATEGORY_DESCRIPTION[category]}
        components={{
          ...PARAGRAPH_COMPONENTS,

          p: (props) => <p {...withoutNode(props)} />,

          ul: (props) => (
            <ul {...withoutNode(props)} className="list-disc pl-[16px]" />
          ),
        }}
      />
    </div>
  );
}

const PARTNERSHIP_CATEGORY_DESCRIPTION: Record<
  ShowPartnershipCategory,
  string
> = {
  [ShowPartnershipCategory.BRONZE]: `À partir de 200 € de don :

- Visibilité digitale (réseaux sociaux, site internet) - **mise en ligne au plus tard en avril 2025**.`,

  [ShowPartnershipCategory.SILVER]: `À partir de 500 € de don :

- Visibilité digitale (réseaux sociaux, site internet) - **mise en ligne au plus tard en avril 2025**.
- Visibilité imprimée (flyer, affiche) - **impression courant avril 2025**.
- Stand offert.
- Flyer dans les gift bags - **à nous fournir au plus tard le vendredi 6 juin à 9h**.`,

  [ShowPartnershipCategory.GOLD]: `À partir de 1 000 € de don :

- Visibilité digitale (réseaux sociaux, site internet) - **mise en ligne au plus tard en avril 2025**.
- Visibilité imprimée (flyer, affiche) - **impression courant avril 2025**.
- Stand offert.
- Flyer dans les gift bags - **à nous fournir au plus tard le vendredi 6 juin à 9h**.
- Visibilité sur les supports de l’association Ani’Meaux pendant 1 an.`,
};

export const SORTED_PARTNERSHIP_CATEGORIES = [
  ShowPartnershipCategory.BRONZE,
  ShowPartnershipCategory.SILVER,
  ShowPartnershipCategory.GOLD,
];

export const EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORY_TRANSLATION: Record<
  ShowExhibitorApplicationOtherPartnershipCategory,
  string
> = {
  [ShowExhibitorApplicationOtherPartnershipCategory.MAYBE]:
    "J’aimerais étudier un peu plus la question",
  [ShowExhibitorApplicationOtherPartnershipCategory.NO_PARTNERSHIP]:
    "Malheureusement ce n’est pas possible",
};

export const SORTED_EXHIBITOR_APPLICATION_OTHER_PARTNERSHIP_CATEGORIES = [
  ShowExhibitorApplicationOtherPartnershipCategory.MAYBE,
  ShowExhibitorApplicationOtherPartnershipCategory.NO_PARTNERSHIP,
];

export function isPartnershipCategory(
  category:
    | ShowPartnershipCategory
    | ShowExhibitorApplicationOtherPartnershipCategory,
): category is ShowPartnershipCategory {
  return SORTED_PARTNERSHIP_CATEGORIES.includes(category);
}
