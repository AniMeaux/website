import { getPageTitle } from "#core/page-title";
import backgroundPattern from "#images/background-pattern.svg";
import nameAndLogo from "#images/name-and-logo.svg";

export const AuthPage = {
  Main: function AuthPageMain({ children }: React.PropsWithChildren<{}>) {
    return (
      <main className="grid w-full grid-cols-[minmax(0px,500px)] justify-center justify-items-center md:min-h-screen md:grid-cols-[1fr_minmax(500px,1fr)]">
        <section
          className="hidden w-full bg-blue-500 bg-repeat md:block"
          style={{ backgroundImage: `url(${backgroundPattern})` }}
        />

        <section className="flex w-full max-w-[500px] flex-col justify-start px-safe-1.5 py-safe-2 md:pl-4 md:pr-safe-4 md:py-safe-4">
          <img
            src={nameAndLogo}
            alt={getPageTitle()}
            className="h-3 self-start md:h-4"
          />

          <section className="mt-4 flex flex-col gap-2 md:mt-[10vh]">
            {children}
          </section>
        </section>
      </main>
    );
  },

  Title: function AuthPageTitle({ children }: React.PropsWithChildren<{}>) {
    return (
      <h1 className="text-title-hero-small md:text-title-hero-large">
        {children}
      </h1>
    );
  },
};
