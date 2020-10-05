import * as React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "../core/link";
import NameAndLogo from "../ui/nameAndLogo.svg";

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
              right: "5%",
            }}
          >
            <h1
              className="mb-8 leading-none"
              style={{ fontFamily: "Playfair Display", fontSize: "5rem" }}
            >
              Adoptez
            </h1>
            <p className="mb-8 w-full">
              Trouvez le compagnon de vos rêves et donnez-lui une seconde
              chance.
            </p>

            <Link
              href="/"
              className="shadow px-6 py-2 rounded bg-blue-500 hover:bg-blue-400 flex items-center font-semibold"
            >
              <FaSearch />
              <span className="ml-4">Chercher</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
