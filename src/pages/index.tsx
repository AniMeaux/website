import cn from "classnames";
import * as React from "react";
import {
  FaAngleDown,
  FaAngleUp,
  FaBars,
  FaFacebook,
  FaInstagram,
  FaSearch,
} from "react-icons/fa";
import {
  AnimalAge,
  AnimalAgesLabels,
  AnimalSpecies,
  AnimalSpeciesLabels,
  ANIMAL_AGES_ORDER,
  ANIMAL_SPECIES_ORDER_ALPHABETICAL,
} from "../core/animal";
import { Link, LinkProps } from "../core/link";
import Logo from "../ui/logo.svg";
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
      className={cn(
        "min-w-0 appearance-none truncate px-6 cursor-pointer a11y-focus",
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
      className={cn(
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
        className="h-12 w-12 flex-none border-4 border-white rounded-full bg-blue-500 md:hover:bg-blue-400 flex items-center justify-center text-white"
      >
        <FaSearch />
      </Link>
    </div>
  );
}

type NavItemMenuProps = {
  label: string;
  children: React.ReactNode;
};

function NavItemMenu({ label, children }: NavItemMenuProps) {
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const rootElement = React.useRef<HTMLLIElement>(null!);
  const buttonElement = React.useRef<HTMLButtonElement>(null!);

  function onBlur(event: React.FocusEvent<HTMLLIElement>) {
    if (
      // We don't want this behaviour for medium and smaller screens.
      window.innerWidth >= 1024 &&
      (event.relatedTarget == null ||
        !rootElement.current.contains(event.relatedTarget as Node))
    ) {
      setIsMenuVisible(false);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
    if (event.key === "Escape" && isMenuVisible) {
      setIsMenuVisible(false);
      buttonElement.current.focus();
    }
  }

  return (
    <li
      className="relative w-full lg:w-auto"
      onBlur={onBlur}
      ref={rootElement}
      onKeyDown={onKeyDown}
    >
      <button
        ref={buttonElement}
        onClick={() => {
          setIsMenuVisible((isMenuVisible) => !isMenuVisible);
          buttonElement.current.focus();
        }}
        className={cn(
          "h-10 flex items-center flex-none opacity-75 font-semibold uppercase a11y-focus w-full md:hover:opacity-100 lg:w-auto",
          { "md:opacity-100": isMenuVisible }
        )}
      >
        <span className="mr-auto lg:mr-1">{label}</span>{" "}
        {isMenuVisible ? <FaAngleUp /> : <FaAngleDown />}
      </button>

      <ul
        children={children}
        className={cn(
          "list-none text-gray-900 font-semibold lg:absolute lg:top-1/1 lg:left-0 lg:mt-2 lg:py-2 lg:w-max-content lg:rounded lg:bg-white",
          { hidden: !isMenuVisible }
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
        className="h-10 flex items-center flex-none lg:px-4 md:hover:bg-gray-200"
      />
    </li>
  );
}

function Header() {
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const buttonElement = React.useRef<HTMLButtonElement>(null!);
  const navElement = React.useRef<HTMLElement>(null!);

  function onBlur(event: React.FocusEvent<HTMLElement>) {
    if (
      event.relatedTarget == null ||
      !navElement.current.contains(event.relatedTarget as Node)
    ) {
      setIsMenuVisible(false);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && isMenuVisible) {
      setIsMenuVisible(false);
      buttonElement.current.focus();
    }
  }

  return (
    <header className="absolute z-10 w-full h-16 px-4 flex items-center text-white">
      <section className="min-w-0 h-full flex-1 flex items-center">
        <button
          title="Afficher le menu"
          onClick={() => {
            setIsMenuVisible((isMenuVisible) => !isMenuVisible);
            buttonElement.current.focus();
          }}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          ref={buttonElement}
          className="w-10 h-10 flex items-center justify-center flex-none text-xl font-semibold uppercase opacity-75 a11y-focus md:hover:opacity-100 lg:hidden"
        >
          <FaBars />
        </button>

        {/* Menu overlay */}
        <div
          aria-hidden
          onClick={() => setIsMenuVisible(false)}
          className={cn(
            "lg:hidden fixed top-0 left-0 w-full h-screen bg-black bg-opacity-25",
            { hidden: !isMenuVisible }
          )}
        />

        <nav
          ref={navElement}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          className={cn(
            "fixed top-0 left-0 w-10/12 h-screen max-w-sm overflow-auto text-sm bg-white text-gray-900 lg:block lg:static lg:w-auto lg:h-auto lg:max-w-none lg:overflow-visible lg:bg-transparent lg:text-white",
            { hidden: !isMenuVisible }
          )}
        >
          <div className="lg:hidden h-16 flex items-center justify-center">
            <Logo className="text-4xl" />
          </div>

          <ul className="mt-4 px-8 list-none flex flex-col items-start space-y-4 lg:mt-0 lg:px-0 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
            <NavItemMenu label="Animaux">
              <NavItemMenuItem href="/search?animalStatus=open_to_adoption">
                À l'adoption
              </NavItemMenuItem>

              <NavItemMenuItem href="/search?animalStatus=adopted">
                Adoptés
              </NavItemMenuItem>

              <NavItemMenuItem href="/search">
                Recherche avancée
              </NavItemMenuItem>
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

            <li className="w-full lg:w-auto">
              <Link
                href="/partners"
                className="w-full h-10 flex items-center flex-none opacity-75 font-semibold uppercase a11y-focus md:hover:opacity-100 lg:w-auto"
              >
                Partenaires
              </Link>
            </li>

            <li className="w-full lg:w-auto">
              <Link
                href="/blog"
                className="w-full h-10 flex items-center flex-none opacity-75 font-semibold uppercase a11y-focus md:hover:opacity-100 lg:w-auto"
              >
                Blog
              </Link>
            </li>
          </ul>
        </nav>
      </section>

      <section className="h-full flex-none flex items-center">
        <Link
          title="Retour à la page d'accueil"
          href="/"
          className="h-10 flex items-center text-4xl"
        >
          <NameAndLogo role="img" className="hidden md:block" />
          <Logo role="img" className="md:hidden" />
        </Link>
      </section>

      <section className="min-w-0 h-full flex-1 flex items-center justify-end text-xl">
        <a
          title="Aller sur la page Facebook"
          href="https://www.facebook.com/animeaux.protectionanimale"
          className="w-10 h-10 flex items-center justify-center opacity-75 a11y-focus md:hover:opacity-100"
        >
          <FaFacebook role="img" />
        </a>

        <a
          title="Aller sur la page Instagram"
          href="https://www.instagram.com/associationanimeaux"
          className="w-10 h-10 flex items-center justify-center opacity-75 a11y-focus md:hover:opacity-100"
        >
          <FaInstagram role="img" />
        </a>
      </section>
    </header>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <section className="relative md:h-screen text-lg md:text-2xl">
          <picture>
            <source srcSet="/landing-image.jpg" media="(min-width: 800px)" />
            <img
              src="/landing-image-small.jpg"
              alt="Adoptez"
              className="w-full h-screen-8/12 md:h-full object-cover"
            />
          </picture>

          <div className="relative md:absolute mx-auto md:mx-0 w-10/12 md:w-auto md:hero-text flex flex-col items-start text-left md:text-white">
            <div>
              <h1 className="mt-10 md:mt-0 mb-4 md:mb-8 leading-none font-serif text-5xl md:text-hero">
                Adoptez-moi, bordel
              </h1>
              <p className="mb-8 w-full">
                Trouvez le compagnon de vos rêves et donnez-lui une seconde
                chance.
              </p>
            </div>

            <SearchForm className="absolute top-0 left-1/2 transform -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 mb-6 md:mb-0 md:static w-full max-w-sm" />
          </div>
        </section>
      </main>
    </>
  );
}
