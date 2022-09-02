import { formatAge } from "@animeaux/shared";
import { Gender, Prisma } from "@prisma/client";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { SPECIES_ICON } from "~/animals/species";
import { ADOPTABLE_ANIMAL_STATUS } from "~/animals/status";
import { actionClassNames } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { getConfig, useConfig } from "~/core/config";
import { MapDateToString } from "~/core/dates";
import { prisma } from "~/core/db.server";
import { isDefined } from "~/core/isDefined";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { GENDER_TRANSLATION, SPECIES_TRANSLATION } from "~/core/translations";
import { ErrorPage, getErrorTitle } from "~/dataDisplay/errorPage";
import { createCloudinaryUrl, DynamicImage } from "~/dataDisplay/image";
import { Markdown, MarkdownProps } from "~/dataDisplay/markdown";
import { Icon, IconProps } from "~/generated/icon";

const animalSelect = Prisma.validator<Prisma.AnimalArgs>()({
  select: {
    id: true,
    avatar: true,
    pictures: true,
    name: true,
    gender: true,
    birthdate: true,
    description: true,
    species: true,
    breed: { select: { name: true } },
    color: { select: { name: true } },
    isOkChildren: true,
    isOkDogs: true,
    isOkCats: true,
    fosterFamily: {
      select: {
        zipCode: true,
        city: true,
      },
    },
  },
});

type Animal = Prisma.AnimalGetPayload<typeof animalSelect>;

type LoaderDataServer = {
  animal: Animal;
};

const UuidSchema = z.string().uuid();

const UUID_LENGTH = 36;

export const loader: LoaderFunction = async ({ params }) => {
  const result = UuidSchema.safeParse(params["slug"]?.slice(-UUID_LENGTH));
  if (!result.success) {
    throw new Response("Not found", { status: 404 });
  }

  const animal = await prisma.animal.findFirst({
    where: { id: result.data, status: { in: ADOPTABLE_ANIMAL_STATUS } },
    select: animalSelect.select,
  });

  if (animal == null) {
    throw new Response("Not found", { status: 404 });
  }

  return json<LoaderDataServer>({ animal });
};

export const meta: MetaFunction = ({ data, parentsData }) => {
  const animal = (data as LoaderDataServer | null)?.animal;
  if (animal == null) {
    return createSocialMeta({ title: getPageTitle(getErrorTitle(404)) });
  }

  const config = getConfig(parentsData);
  return createSocialMeta({
    title: getPageTitle(`Adopter ${animal.name}`),
    imageUrl: createCloudinaryUrl(config.cloudinary.cloudName, animal.avatar, {
      size: "1024",
      aspectRatio: "16:9",
    }),
  });
};

export function CatchBoundary() {
  const caught = useCatch();
  return <ErrorPage status={caught.status} />;
}

type LoaderDataClient = MapDateToString<LoaderDataServer>;

export default function AnimalPage() {
  const { animal } = useLoaderData<LoaderDataClient>();

  return (
    <main className="w-full px-page flex flex-col gap-12">
      <header
        className={cn(
          "flex flex-col",
          "md:grid md:grid-rows-[auto] md:grid-cols-[1fr,auto] md:items-center md:gap-6"
        )}
      >
        <h1
          className={cn(
            "px-4 text-title-hero-small text-center break-words",
            "md:px-0 md:text-title-hero-large md:text-left"
          )}
        >
          {animal.name}
        </h1>

        <div
          className={cn(
            "hidden",
            "md:flex md:flex-wrap md:items-center md:justify-end md:gap-x-6 md:gap-y-3"
          )}
        >
          <Actions />
        </div>
      </header>

      <section
        className={cn("flex flex-col gap-12", "md:flex-row md:items-center")}
      >
        <ImageAside animal={animal} className="md:flex-[1_1_66%]" />
        <InfoAside animal={animal} className="md:flex-[1_1_34%] md:max-w-xs" />
      </section>

      <DescriptionSection animal={animal} />

      <div className={cn("flex flex-col items-center gap-3", "md:hidden")}>
        <Actions />
      </div>
    </main>
  );
}

function Actions() {
  const { adoptionFormUrl } = useConfig();

  return (
    <>
      <BaseLink
        to="/conditions-d-adoption"
        className={actionClassNames.standalone({ color: "gray" })}
      >
        Voir les conditions d'adoption
      </BaseLink>

      <BaseLink to={adoptionFormUrl} className={actionClassNames.standalone()}>
        Je l'adopte
      </BaseLink>
    </>
  );
}

function ImageAside({
  animal,
  className,
}: {
  animal: LoaderDataClient["animal"];
  className: string;
}) {
  const allPictures = [animal.avatar].concat(animal.pictures);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);

  return (
    <aside className={cn(className, "flex flex-col gap-6")}>
      <div
        ref={scrollContainerRef}
        onScroll={(event) => {
          setVisibleIndex(
            Math.round(
              event.currentTarget.scrollLeft / event.currentTarget.clientWidth
            )
          );
        }}
        className="overflow-auto snap-x snap-mandatory scrollbars-none scroll-smooth min-w-0 rounded-bubble-ratio flex"
      >
        {allPictures.map((pictureId, index) => (
          <DynamicImage
            key={pictureId}
            imageId={pictureId}
            alt={`Photo ${index + 1} de ${animal.name}`}
            sizes={{ lg: "512px", md: "50vw", default: "100vw" }}
            fallbackSize="2048"
            loading="eager"
            className="snap-center w-full min-w-0 h-full min-h-0 aspect-4/3 flex-none"
          />
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,64px)] grid-rows-[auto] gap-3 justify-center">
        {allPictures.map((pictureId, index) => (
          <button
            key={pictureId}
            onClick={() => {
              invariant(
                scrollContainerRef.current != null,
                "scrollContainerRef should be set"
              );

              scrollContainerRef.current.scrollTo(
                index * scrollContainerRef.current.clientWidth,
                0
              );
            }}
          >
            <DynamicImage
              imageId={pictureId}
              alt={`Photo ${index + 1} de ${animal.name}`}
              sizes={{ default: "64px" }}
              fallbackSize="512"
              loading="eager"
              className={cn(
                "w-16 aspect-4/3 rounded-bubble-ratio transition-opacity duration-100 ease-in-out",
                {
                  "opacity-50": visibleIndex !== index,
                  "opacity-100": visibleIndex === index,
                }
              )}
            />
          </button>
        ))}
      </div>
    </aside>
  );
}

function InfoAside({
  animal,
  className,
}: {
  animal: LoaderDataClient["animal"];
  className: string;
}) {
  return (
    <aside className={cn(className, "px-4 flex flex-col gap-6")}>
      <InfoList animal={animal} />
      <Aggrements animal={animal} />
    </aside>
  );
}

function InfoList({ animal }: { animal: LoaderDataClient["animal"] }) {
  const speciesLabels = [
    SPECIES_TRANSLATION[animal.species],
    animal.breed?.name,
    animal.color?.name,
  ]
    .filter(isDefined)
    .join(" • ");

  return (
    <ul className="flex flex-col gap-3">
      <Item
        icon={animal.gender === Gender.FEMALE ? "venus" : "mars"}
        color={animal.gender === Gender.FEMALE ? "pink" : "blue"}
      >
        {GENDER_TRANSLATION[animal.gender]}
      </Item>

      <Item icon={SPECIES_ICON[animal.species]}>{speciesLabels}</Item>

      <Item icon="cakeCandles">
        {DateTime.fromISO(animal.birthdate).toLocaleString(DateTime.DATE_FULL)}{" "}
        ({formatAge(animal.birthdate)})
      </Item>

      {animal.fosterFamily != null && (
        <Item icon="locationDot">
          En famille d'accueil à {animal.fosterFamily.city} (
          {animal.fosterFamily.zipCode.slice(0, 2)})
        </Item>
      )}
    </ul>
  );
}

function Item({
  icon,
  color = "default",
  children,
}: {
  icon: IconProps["id"];
  color?: "pink" | "blue" | "default";
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon
        id={icon}
        className={cn("flex-none text-[24px]", {
          "text-gray-700": color === "default",
          "text-pink-500": color === "pink",
          "text-brandBlue": color === "blue",
        })}
      />
      <span className="flex-1">{children}</span>
    </li>
  );
}

function Aggrements({ animal }: { animal: LoaderDataClient["animal"] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-caption-default text-gray-600">Ses ententes</h2>
      <ul className={cn("flex gap-3", "md:gap-6")}>
        <Agreement entity="babies" value={animal.isOkChildren} />
        <Agreement entity="cats" value={animal.isOkCats} />
        <Agreement entity="dogs" value={animal.isOkDogs} />
      </ul>
    </div>
  );
}

function Agreement({
  entity,
  value,
}: {
  entity: "babies" | "cats" | "dogs";
  value: boolean | null;
}) {
  let icon: IconProps["id"] =
    entity === "babies"
      ? value == null
        ? "babyCircleQuestion"
        : value
        ? "babyCircleCheck"
        : "babyCircleXMark"
      : entity === "cats"
      ? value == null
        ? "catCircleQuestion"
        : value
        ? "catCircleCheck"
        : "catCircleXMark"
      : value == null
      ? "dogCircleQuestion"
      : value
      ? "dogCircleCheck"
      : "dogCircleXMark";

  return (
    <li
      className={cn(
        "flex-1 rounded-bubble-sm p-3 flex flex-col items-center justify-center gap-2",
        {
          "bg-gray-100 text-gray-700": value == null,
          "bg-brandGreen-lightest text-brandGreen": value === true,
          "bg-brandRed-lightest text-brandRed": value === false,
        }
      )}
    >
      <Icon id={icon} className="text-[32px]" />
      <span className="font-sans text-[14px] font-semibold leading-none">
        {value == null ? "Inconnu" : value ? "Oui" : "Non"}
      </span>
    </li>
  );
}

const DESCRIPTION_COMPONENTS: MarkdownProps["components"] = {
  br: () => <br />,
  p: ({ children }) => <p>{children}</p>,
};

function DescriptionSection({
  animal,
}: {
  animal: LoaderDataClient["animal"];
}) {
  if (animal.description == null) {
    return null;
  }

  return (
    <section
      className={cn(
        "px-4 flex flex-col",
        "md:px-0 md:py-6 md:flex-row md:gap-6"
      )}
    >
      <Icon
        id="quoteLeft"
        className={cn(
          "flex-none self-start text-[60px] text-gray-300",
          "md:text-[96px]"
        )}
      />

      <Markdown
        components={DESCRIPTION_COMPONENTS}
        className="flex flex-col gap-6"
      >
        {animal.description}
      </Markdown>

      <Icon
        id="quoteRight"
        className={cn(
          "flex-none self-end text-[60px] text-gray-300",
          "md:text-[96px]"
        )}
      />
    </section>
  );
}
