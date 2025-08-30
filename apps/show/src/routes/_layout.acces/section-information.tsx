import { HighLightBackground } from "#core/layout/highlight-background";
import { LazyElement } from "#core/layout/lazy-element";
import { Section } from "#core/layout/section";
import { Pictogram } from "#generated/pictogram";

export function SectionInformation() {
  return (
    <LazyElement asChild>
      <Section.Root
        columnCount={1}
        width="full"
        className="translate-y-4 opacity-0 transition-[opacity,transform] duration-very-slow data-visible:translate-y-0 data-visible:opacity-100"
      >
        <div className="relative py-2 px-safe-page-narrow md:py-4 md:px-safe-page-normal">
          <HighLightBackground
            color="paleBlue"
            className="absolute inset-0 -z-just-above h-full w-full"
          />

          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
            <HighLightItem icon="location" title="Adresse">
              Colisée de Meaux, 73 Av. Henri Dunant, 77100 Meaux.
            </HighLightItem>

            <HighLightItem icon="time" title="Horaires d’ouverture">
              Samedi 6 juin 2026 de 10h à 18h.
              <br />
              Dimanche 7 juin 2026 de 10h à 18h.
            </HighLightItem>

            <HighLightItem icon="bus" title="Venir en transports en commun">
              Bus ligne D ou I, arrêt Colisée de Meaux ou Roland Garros.
            </HighLightItem>

            <HighLightItem icon="car" title="Venir en voiture">
              Parking gratuit sur place.
              <br />
              <strong className="text-body-lowercase-emphasis">
                Ne laissez pas vos animaux dans votre véhicule !
              </strong>
            </HighLightItem>
          </ul>
        </div>
      </Section.Root>
    </LazyElement>
  );
}

function HighLightItem({
  icon,
  title,
  children,
}: React.PropsWithChildren<{
  icon: React.ComponentProps<typeof Pictogram>["id"];
  title: string;
}>) {
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2">
      <Pictogram id={icon} className="text-[48px]" />
      <div className="grid grid-cols-1">
        <p className="text-body-uppercase-emphasis">{title}</p>
        <p>{children}</p>
      </div>
    </li>
  );
}
