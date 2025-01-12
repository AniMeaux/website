import { Footer } from "#core/layout/footer";

export function LayoutFooter() {
  return (
    <Footer.Root>
      <Footer.WaveSection />

      <Footer.ContentSection className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center lg:gap-8">
        <Footer.AnimeauxLogo isLarge />
        <Footer.Links />
      </Footer.ContentSection>

      <Footer.LegalSection />
    </Footer.Root>
  );
}
