import type { IconName } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import { ExhibitorTag } from "@prisma/client";
import difference from "lodash.difference";
import orderBy from "lodash.orderby";

export const ExhibitorSearchParams = SearchParamsDelegate.create({
  tags: {
    key: "tag",
    schema: zu.searchParams.set(zu.searchParams.nativeEnum(ExhibitorTag)),
  },
});

export const EXHIBITOR_TAG_TRANSLATIONS: Record<ExhibitorTag, string> = {
  [ExhibitorTag.DOGS]: "Chiens",
  [ExhibitorTag.ACCESSORIES]: "Accessoires",
  [ExhibitorTag.ALTERNATIVE_MEDICINE]: "Médecine douce",
  [ExhibitorTag.ARTIST]: "Artiste",
  [ExhibitorTag.ASSOCIATION]: "Association",
  [ExhibitorTag.BEHAVIOR]: "Comportement",
  [ExhibitorTag.CARE]: "Soins",
  [ExhibitorTag.CATS]: "Chats",
  [ExhibitorTag.CITY]: "Mairie",
  [ExhibitorTag.DRAWING]: "Illustration",
  [ExhibitorTag.EDITING]: "Edition",
  [ExhibitorTag.EDUCATION]: "Education",
  [ExhibitorTag.FOOD]: "Alimentation",
  [ExhibitorTag.HUMANS]: "Humains",
  [ExhibitorTag.NACS]: "NACs",
  [ExhibitorTag.PHOTOGRAPHER]: "Photographe",
  [ExhibitorTag.RABBITS]: "Lapins",
  [ExhibitorTag.SENSITIZATION]: "Sensibilisation",
  [ExhibitorTag.SERVICES]: "Services",
  [ExhibitorTag.TRAINING]: "Formation",
  [ExhibitorTag.WILDLIFE]: "Faune sauvage",
};

export let SORTED_EXHIBITOR_TAGS = orderBy(
  Object.values(ExhibitorTag),
  (status) => EXHIBITOR_TAG_TRANSLATIONS[status],
);

export const EXHIBITOR_TARGET_TAGS: ExhibitorTag[] = orderBy(
  [
    ExhibitorTag.CATS,
    ExhibitorTag.DOGS,
    ExhibitorTag.HUMANS,
    ExhibitorTag.NACS,
    ExhibitorTag.RABBITS,
    ExhibitorTag.WILDLIFE,
  ],
  (status) => EXHIBITOR_TAG_TRANSLATIONS[status],
);

export const EXHIBITOR_ACTIVITY_TAGS = difference(
  SORTED_EXHIBITOR_TAGS,
  EXHIBITOR_TARGET_TAGS,
);

SORTED_EXHIBITOR_TAGS = EXHIBITOR_TARGET_TAGS.concat(EXHIBITOR_ACTIVITY_TAGS);

export function ExhibitorTagChip({
  tag,
  isHighlighted,
  className,
}: {
  tag: ExhibitorTag;
  isHighlighted: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid grid-cols-[auto_auto] items-center gap-0.5 rounded-0.5 px-0.5 transition-colors duration-150",
        isHighlighted
          ? "bg-mystic text-white"
          : "ring-1 ring-inset ring-alabaster",
        className,
      )}
    >
      <Icon
        id={EXHIBITOR_TAG_ICON[tag][isHighlighted ? "solid" : "light"]}
        className="text-[16px]"
      />

      <span
        className={
          isHighlighted
            ? "text-caption-lowercase-emphasis"
            : "text-caption-lowercase-default"
        }
      >
        {EXHIBITOR_TAG_TRANSLATIONS[tag]}
      </span>
    </span>
  );
}

export function ExhibitorTagFilter({
  tag,
  className,
}: {
  tag: ExhibitorTag;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "group relative grid cursor-pointer auto-cols-auto grid-flow-col gap-1 rounded-0.5 bg-mystic px-1 py-0.5 text-white transition-transform duration-100 active:scale-95 hover:scale-105 hover:active:scale-95",
        className,
      )}
    >
      <input
        type="checkbox"
        defaultChecked
        name={ExhibitorSearchParams.keys.tags}
        value={tag}
        className="absolute left-0 top-0 -z-10 h-full w-full cursor-pointer appearance-none rounded-0.5 focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg"
      />

      <span className="grid auto-cols-auto grid-flow-col gap-0.5">
        <Icon
          id={EXHIBITOR_TAG_ICON[tag].solid}
          className="text-[24px] group-hover:hidden"
        />

        <Icon
          id="x-mark-light"
          className="hidden text-[24px] group-hover:block"
        />

        <span className="text-body-lowercase-emphasis">
          {EXHIBITOR_TAG_TRANSLATIONS[tag]}
        </span>
      </span>

      <Icon
        id="x-mark-light"
        className="text-[24px] [@media(any-hover:hover)]:hidden"
      />
    </label>
  );
}

export function ExhibitorTagSelector({
  tag,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"input"> & {
  tag: ExhibitorTag;
}) {
  return (
    <label
      className={cn(
        "group relative grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1 rounded-0.5 px-1 py-0.5 transition-transform duration-100 hover:scale-105 hover:active:scale-95 [@media(any-hover:hover)]:active:scale-95",
        className,
      )}
    >
      <input
        {...props}
        type="checkbox"
        name={ExhibitorSearchParams.keys.tags}
        value={tag}
        onChange={() => {}}
        className="peer absolute left-0 top-0 -z-10 h-full w-full cursor-pointer appearance-none rounded-0.5 transition-colors duration-100 checked:bg-mystic focus-visible:outline-none focus-visible:ring focus-visible:ring-mystic focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg"
      />

      <Icon
        id={EXHIBITOR_TAG_ICON[tag].light}
        className="text-[24px] peer-checked:hidden"
      />

      <Icon
        id={EXHIBITOR_TAG_ICON[tag].solid}
        className="hidden text-[24px] text-white peer-checked:block"
      />

      <span className="transition-colors duration-100 text-body-lowercase-default peer-checked:text-white peer-checked:text-body-lowercase-emphasis">
        {EXHIBITOR_TAG_TRANSLATIONS[tag]}
      </span>

      <span className="grid aspect-square w-[16px] items-center justify-center rounded-0.5 border border-mystic text-transparent transition-colors duration-100 peer-checked:border-white peer-checked:bg-white peer-checked:text-mystic">
        <Icon id="check-solid" className="text-[12px]" />
      </span>
    </label>
  );
}

const EXHIBITOR_TAG_ICON: Record<
  ExhibitorTag,
  { solid: IconName; light: IconName }
> = {
  [ExhibitorTag.DOGS]: {
    light: "dog-light",
    solid: "dog-solid",
  },
  [ExhibitorTag.ACCESSORIES]: {
    light: "teddy-bear-light",
    solid: "teddy-bear-solid",
  },
  [ExhibitorTag.ALTERNATIVE_MEDICINE]: {
    light: "hand-holding-heart-light",
    solid: "hand-holding-heart-solid",
  },
  [ExhibitorTag.ARTIST]: {
    light: "palette-light",
    solid: "palette-solid",
  },
  [ExhibitorTag.ASSOCIATION]: {
    light: "people-group-light",
    solid: "people-group-solid",
  },
  [ExhibitorTag.BEHAVIOR]: {
    light: "shield-paw-light",
    solid: "shield-paw-solid",
  },
  [ExhibitorTag.CARE]: {
    light: "heart-light",
    solid: "heart-solid",
  },
  [ExhibitorTag.CATS]: {
    light: "cat-light",
    solid: "cat-solid",
  },
  [ExhibitorTag.CITY]: {
    light: "school-light",
    solid: "school-solid",
  },
  [ExhibitorTag.DRAWING]: {
    light: "pen-paintbrush-light",
    solid: "pen-paintbrush-solid",
  },
  [ExhibitorTag.EDITING]: {
    light: "book-open-light",
    solid: "book-open-solid",
  },
  [ExhibitorTag.EDUCATION]: {
    light: "shield-dog-light",
    solid: "shield-dog-solid",
  },
  [ExhibitorTag.FOOD]: {
    light: "bowl-food-light",
    solid: "bowl-food-solid",
  },
  [ExhibitorTag.HUMANS]: {
    light: "people-simple-light",
    solid: "people-simple-solid",
  },
  [ExhibitorTag.NACS]: {
    light: "mouse-field-light",
    solid: "mouse-field-solid",
  },
  [ExhibitorTag.PHOTOGRAPHER]: {
    light: "camera-light",
    solid: "camera-solid",
  },
  [ExhibitorTag.RABBITS]: {
    light: "rabbit-light",
    solid: "rabbit-solid",
  },
  [ExhibitorTag.SENSITIZATION]: {
    light: "comments-light",
    solid: "comments-solid",
  },
  [ExhibitorTag.SERVICES]: {
    light: "badge-check-light",
    solid: "badge-check-solid",
  },
  [ExhibitorTag.TRAINING]: {
    light: "file-certificate-light",
    solid: "file-certificate-solid",
  },
  [ExhibitorTag.WILDLIFE]: {
    light: "squirrel-light",
    solid: "squirrel-solid",
  },
};
