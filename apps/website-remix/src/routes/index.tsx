import { SearchForm } from "~/controllers/searchForm";
import { heroImages } from "~/images/hero";
import { SplitSection } from "~/layout/splitSection";

export default function HomePage() {
  return (
    <main className="px-page flex flex-col gap-24">
      <SplitSection
        title="Adoptez !"
        message="Trouvez le compagnon de vos rêves et donnez-lui une seconde chance"
        action={<SearchForm className="w-full max-w-sm" />}
        imageAlt="Chien alongé dans l'herbe, tirant la langue"
        image={heroImages}
        hasLargeTitle
        isReversed
      />
    </main>
  );
}
