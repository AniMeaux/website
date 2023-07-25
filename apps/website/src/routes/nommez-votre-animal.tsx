import { Gender, Prisma } from "@prisma/client";
import { LoaderArgs, json } from "@remix-run/node";
import {
  Form,
  V2_MetaFunction,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import orderBy from "lodash.orderby";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { ACTIVE_ANIMAL_STATUS } from "~/animals/status";
import { actionClassNames } from "~/core/actions";
import { cn } from "~/core/classNames";
import { prisma } from "~/core/db.server";
import { createSocialMeta } from "~/core/meta";
import { getPageTitle } from "~/core/pageTitle";
import { Icon } from "~/generated/icon";

// Multiple of 2 and 3 to be nicely displayed.
const ANIMAL_NAME_COUNT_PER_PAGE = 18;

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = getSearchParams(url.searchParams);

  // We don't want to suggest names used by active animals.
  const activeAnimals = await prisma.animal.findMany({
    where: {
      name:
        searchParams.l == null
          ? undefined
          : { startsWith: searchParams.l, mode: "insensitive" },
      status: { in: ACTIVE_ANIMAL_STATUS },
    },
    select: { name: true },
  });

  const where: Prisma.AnimalNameSuggestionWhereInput[] = [
    {
      name: {
        notIn: activeAnimals.map((animal) => animal.name),
        mode: "insensitive",
      },
    },
  ];

  if (searchParams.l != null) {
    where.push({ name: { startsWith: searchParams.l, mode: "insensitive" } });
  }

  if (searchParams.g != null) {
    // Names relevent for both genders (gender: null) should always be
    // suggested.
    where.push({ OR: [{ gender: searchParams.g }, { gender: null }] });
  }

  const count = await prisma.animalNameSuggestion.count({
    where: { AND: where },
  });

  // Order indexes so the names will be alphabetically ordered.
  const indexesToPick = orderBy(
    pickRandom(
      Array.from({ length: count }, (_, i) => i),
      ANIMAL_NAME_COUNT_PER_PAGE
    )
  );

  const suggestions = await Promise.all(
    indexesToPick.map(async (index) => {
      // Use `findMany` so we can use pagination options to get by index.
      const suggestions = await prisma.animalNameSuggestion.findMany({
        where: { AND: where },
        orderBy: { name: "asc" },
        skip: index,
        take: 1,
        select: { name: true, gender: true },
      });

      invariant(suggestions[0], "The name should exists.");

      return suggestions[0];
    })
  );

  return json({ suggestions });
}

export const meta: V2_MetaFunction = () => {
  return createSocialMeta({ title: getPageTitle("Nommez votre animal") });
};

export default function Route() {
  const { suggestions } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const params = getSearchParams(searchParams);

  return (
    <main className={cn("w-full px-page flex flex-col gap-12", "md:gap-24")}>
      <header className="flex flex-col gap-6">
        <h1
          className={cn(
            "text-title-hero-small text-center",
            "md:text-title-hero-large md:text-left"
          )}
        >
          Nommez votre animal
        </h1>

        <p className={cn("text-center", "md:text-left")}>
          Vous ne savez pas comment nommer votre animal ? Voici notre outils
          pour vous aider !
        </p>
      </header>

      <div
        className={cn(
          "flex flex-col gap-12",
          "md:flex-row md:items-start md:gap-24"
        )}
      >
        <section
          className={cn(
            "shadow-base rounded-bubble-lg bg-white p-6 flex",
            "md:flex-1 md:max-w-xs"
          )}
        >
          <Form method="GET" className="w-full flex flex-col gap-6">
            <h2 className="text-title-item">Critères</h2>

            <div className="flex flex-col gap-3">
              <div className={formClassNames.field()}>
                <label
                  htmlFor="first-letter"
                  className={formClassNames.label()}
                >
                  Première lettre
                </label>

                <FirstLetterInput defaultValue={params.l ?? ""} />
              </div>

              <div className={formClassNames.field()}>
                <span className={formClassNames.label()}>Genre</span>

                <label className={formClassNames.checkboxLabel()}>
                  <input
                    type="radio"
                    name="g"
                    value=""
                    defaultChecked={!params.g}
                    className={formClassNames.checkbox()}
                  />
                  Indiférent
                </label>

                <label className={formClassNames.checkboxLabel()}>
                  <input
                    type="radio"
                    name="g"
                    value={Gender.FEMALE}
                    defaultChecked={params.g === Gender.FEMALE}
                    className={formClassNames.checkbox()}
                  />
                  Femelle
                </label>

                <label className={formClassNames.checkboxLabel()}>
                  <input
                    type="radio"
                    name="g"
                    value={Gender.MALE}
                    defaultChecked={params.g === Gender.MALE}
                    className={formClassNames.checkbox()}
                  />
                  Mâle
                </label>
              </div>
            </div>

            <button type="submit" className={actionClassNames.standalone()}>
              Trouver un nom
            </button>
          </Form>
        </section>

        <section
          className={cn("flex flex-col items-center gap-12", "md:flex-1")}
        >
          {suggestions.length === 0 ? (
            <p
              className={cn(
                "w-full py-12 text-gray-500 text-center",
                "md:py-40"
              )}
            >
              Aucun nom trouvé.
            </p>
          ) : (
            <>
              <ul
                className={cn(
                  "w-full grid grid-cols-1 grid-rows-[auto] gap-6 items-start",
                  "xs:grid-cols-2",
                  "sm:grid-cols-3",
                  "md:grid-cols-2 md:gap-y-12",
                  "lg:grid-cols-3"
                )}
              >
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.name}
                    className="flex items-center justify-center gap-1"
                  >
                    <span className="flex items-center text-[20px]">
                      {suggestion.gender !== Gender.MALE ? (
                        <Icon id="venus" className="text-pink-500" />
                      ) : null}

                      {suggestion.gender !== Gender.FEMALE ? (
                        <Icon id="mars" className="text-brandBlue" />
                      ) : null}
                    </span>

                    <span className="text-title-item">{suggestion.name}</span>
                  </li>
                ))}
              </ul>

              <Form method="GET" replace preventScrollReset className="flex">
                <input type="hidden" name="l" value={params.l ?? ""} />
                <input type="hidden" name="g" value={params.g ?? ""} />

                <button
                  type="submit"
                  className={actionClassNames.standalone({ color: "gray" })}
                >
                  Voir d’autres noms
                </button>
              </Form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

const formClassNames = {
  field: () => "flex flex-col",
  label: () => "text-caption-default text-gray-500",
  checkboxLabel: () => "flex items-center gap-2 cursor-pointer",
  checkbox: () =>
    "appearance-none w-[14px] h-[14px] rounded-full ring-inset ring-gray-400 ring-1 checked:ring-4 checked:ring-brandBlue transition-shadow duration-100 ease-in-out",
};

function FirstLetterInput({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <input
      type="text"
      name="l"
      id="first-letter"
      value={value}
      onChange={(event) => {
        let value = (event.target.value.at(-1) ?? "").toUpperCase();
        if (!/^[A-Z]$/.test(value)) {
          value = "";
        }

        setValue(value);
      }}
      className="w-full rounded-bubble-sm border border-gray-200 px-6 py-2"
    />
  );
}

const LoaderSearchParamsSchema = z.object({
  l: zfd.text(
    z
      .string()
      .regex(/^[A-Z]?$/)
      .optional()
      .catch(undefined)
  ),
  g: z.nativeEnum(Gender).optional().catch(undefined),
});

function getSearchParams(searchParams: URLSearchParams) {
  return zfd.formData(LoaderSearchParamsSchema).parse(searchParams);
}

// Inspired by Faker's `arrayElements`.
// https://github.com/faker-js/faker/blob/v7.5.0/src/modules/helpers/index.ts#L431
function pickRandom<T>(array: T[], count: number) {
  count = Math.min(count, array.length);
  const arrayCopy = array.slice();

  for (let currentCount = 0; currentCount < count; currentCount++) {
    const index = Math.floor((array.length - currentCount) * Math.random());
    const temp = arrayCopy[index];
    invariant(temp != null, "First element should exists");

    const temp2 = arrayCopy[array.length - currentCount - 1];
    invariant(temp2 != null, "Second element should exists");

    arrayCopy[index] = temp2;
    arrayCopy[array.length - currentCount - 1] = temp;
  }

  return arrayCopy.slice(array.length - count);
}
