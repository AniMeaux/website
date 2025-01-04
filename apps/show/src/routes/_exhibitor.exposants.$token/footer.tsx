import { Footer } from "#core/layout/footer";

export function ExhibitorFooter() {
  return (
    <Footer.Root>
      <Footer.WaveSection />

      <Footer.ContentSection className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center lg:gap-8">
        <Footer.AnimeauxLogo />

        <Footer.Links />
      </Footer.ContentSection>

      <Footer.LegalSection />
    </Footer.Root>
  );
}
