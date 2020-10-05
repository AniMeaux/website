import classnames from "classnames";
import * as React from "react";
import { FaSearch } from "react-icons/fa";
import {
  AnimalAge,
  AnimalAgesLabels,
  AnimalSpecies,
  AnimalSpeciesLabels,
  ANIMAL_AGES_ORDER,
  ANIMAL_SPECIES_ORDER_ALPHABETICAL,
} from "../core/animal";
import { Link } from "../core/link";
import NameAndLogo from "../ui/nameAndLogo.svg";

type SelectProps<ValueType> = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value"
> & {
  value: ValueType | null;
  onChange: (value: ValueType) => void;
  label: string;
};

function Select<ValueType = string>({
  value,
  onChange,
  label,
  children,
  className,
  ...rest
}: SelectProps<ValueType>) {
  return (
    <select
      {...rest}
      value={`${value}` ?? ""}
      onChange={(e) => {
        onChange((e.target.value as any) as ValueType);
      }}
      className={classnames(
        "min-w-0 appearance-none truncate px-6 cursor-pointer",
        {
          "text-gray-600": value == null,
          "text-gray-900": value != null,
        },
        className
      )}
    >
      <option disabled value="">
        {label}
      </option>

      {children}
    </select>
  );
}

function SearchForm({ className }: React.FormHTMLAttributes<HTMLFormElement>) {
  const [
    animalSpecies,
    setAnimalSpecies,
  ] = React.useState<AnimalSpecies | null>(null);
  const [animalAge, setAnimalAge] = React.useState<AnimalAge | null>(null);

  const queries: string[] = [];
  if (animalSpecies != null) {
    queries.push(`species=${animalSpecies.toLocaleLowerCase()}`);
  }
  if (animalAge != null) {
    queries.push(`age=${animalAge.toLocaleLowerCase()}`);
  }

  let link = "/search";
  if (queries.length > 0) {
    link = `${link}?${queries.join("&")}`;
  }

  return (
    <div
      className={classnames(
        "shadow h-12 rounded-full bg-white flex items-center text-xl",
        className
      )}
    >
      <Select
        label="Espèce"
        id="species"
        name="species"
        value={animalSpecies}
        onChange={(value) => setAnimalSpecies(value)}
        className="h-full flex-1 min-w-0 rounded-l-full border-r focus:z-10"
      >
        {ANIMAL_SPECIES_ORDER_ALPHABETICAL.map((animalSpecies) => (
          <option key={animalSpecies} value={animalSpecies}>
            {AnimalSpeciesLabels[animalSpecies]}
          </option>
        ))}
      </Select>

      <Select
        label="Âge"
        id="age"
        name="age"
        value={animalAge}
        onChange={(value) => setAnimalAge(value)}
        className="h-full flex-1 min-w-0 focus:z-10"
      >
        {ANIMAL_AGES_ORDER.map((animalAge) => (
          <option key={animalAge} value={animalAge}>
            {AnimalAgesLabels[animalAge]}
          </option>
        ))}
      </Select>

      <Link
        href={link}
        className="h-12 w-12 flex-none border-4 border-white rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center"
      >
        <FaSearch />
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <header className="absolute z-10 w-full h-16 px-4 flex items-center text-white text-sm">
        <Link href="/" className="p-2">
          <NameAndLogo className="text-4xl" />
        </Link>

        <span className="ml-auto p-2 flex items-center flex-none uppercase">
          Animaux
        </span>
        <span className="p-2 flex items-center flex-none uppercase">Agir</span>
        <span className="p-2 flex items-center flex-none uppercase">
          Partenaires
        </span>
        <span className="p-2 flex items-center flex-none uppercase">Blog</span>
      </header>

      <main>
        <section className="relative h-screen text-2xl">
          <img
            src="/landing-image.jpg"
            alt="Adoptez"
            className="h-full w-full object-cover"
          />

          <div
            className="absolute flex flex-col items-start text-left text-white"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              left: "55%",
              width: "40%",
            }}
          >
            <h1 className="mb-8 leading-none font-serif text-hero">
              Adoptez-moi, bordel
            </h1>
            <p className="mb-8 w-full">
              Trouvez le compagnon de vos rêves et donnez-lui une seconde
              chance.
            </p>

            <SearchForm className="w-full max-w-sm" />
          </div>
        </section>
      </main>
    </>
  );
}
