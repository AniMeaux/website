import classnames from "classnames";
import * as React from "react";
import { FaAngleDown, FaAngleUp, FaSearch } from "react-icons/fa";
import {
  AnimalAge,
  AnimalAgesLabels,
  AnimalSpecies,
  AnimalSpeciesLabels,
  ANIMAL_AGES_ORDER,
  ANIMAL_SPECIES_ORDER_ALPHABETICAL,
} from "../core/animal";
import { Link, LinkProps } from "../core/link";
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
      value={value == null ? "" : `${value}`}
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

const NavItemClasses =
  "px-4 py-2 flex items-center flex-none font-semibold uppercase rounded hover:bg-white hover:bg-opacity-10";

type NavItemMenuProps = {
  label: string;
  children: React.ReactNode;
};

function NavItemMenu({ label, children }: NavItemMenuProps) {
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);

  const rootElement = React.useRef<HTMLLIElement>(null!);

  function onBlur(event: React.FocusEvent<HTMLLIElement>) {
    if (
      event.relatedTarget == null ||
      !rootElement.current.contains(event.relatedTarget as Node)
    ) {
      setIsMenuVisible(false);
    }
  }

  return (
    <li className="relative" onBlur={onBlur} ref={rootElement}>
      <button
        onClick={() => setIsMenuVisible((isMenuVisible) => !isMenuVisible)}
        className={classnames(NavItemClasses, {
          "bg-white": isMenuVisible,
          "bg-opacity-25": isMenuVisible,
        })}
      >
        <span className="mr-2">{label}</span>{" "}
        {isMenuVisible ? <FaAngleUp /> : <FaAngleDown />}
      </button>

      <ul
        children={children}
        className={classnames(
          "absolute top-1/1 left-0 mt-2 py-2 list-none w-max-content rounded bg-white text-gray-900 font-semibold",
          {
            hidden: !isMenuVisible,
          }
        )}
      />
    </li>
  );
}

function NavItemMenuItem(props: LinkProps) {
  return (
    <li>
      <Link
        {...props}
        className="px-4 py-2 flex items-center flex-none hover:bg-gray-200"
      />
    </li>
  );
}

function Header() {
  return (
    <header className="absolute z-10 w-full h-16 px-4 flex items-center text-white">
      <Link href="/" className="p-2 rounded hover:bg-white hover:bg-opacity-10">
        <NameAndLogo className="text-4xl" />
      </Link>

      <nav className="ml-auto text-sm">
        <ul className="list-none flex items-center space-x-2">
          <NavItemMenu label="Animaux">
            <NavItemMenuItem href="/search?animalStatus=open_to_adoption">
              À l'adoption
            </NavItemMenuItem>

            <NavItemMenuItem href="/search?animalStatus=adopted">
              Adoptés
            </NavItemMenuItem>

            <NavItemMenuItem href="/search">Recherche avancée</NavItemMenuItem>
          </NavItemMenu>

          <NavItemMenu label="Agir">
            <NavItemMenuItem href="/host-family">
              Devenir famille d'accueil
            </NavItemMenuItem>

            <NavItemMenuItem href="/volunteer">
              Devenir bénévole
            </NavItemMenuItem>

            <NavItemMenuItem href="/donate">Faire un don</NavItemMenuItem>
          </NavItemMenu>

          <li>
            <Link href="/partners" className={NavItemClasses}>
              Partenaires
            </Link>
          </li>

          <li>
            <Link href="/blog" className={NavItemClasses}>
              Blog
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />

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
