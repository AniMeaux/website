import { SubNavItem } from "~/layout/navigation/shared";

export function SubNavWarn({
  elementToFocusRef,
}: {
  elementToFocusRef: React.RefObject<HTMLAnchorElement>;
}) {
  return (
    <div className="flex flex-col">
      <SubNavItem
        ref={elementToFocusRef}
        color="green"
        icon="catTree"
        to="/signaler-un-animal-errant"
      >
        Signaler un animal errant
      </SubNavItem>

      <SubNavItem
        color="red"
        icon="sirenOn"
        to="/informer-d-un-acte-de-maltraitance"
      >
        Informer d'un acte de maltraitance
      </SubNavItem>

      <SubNavItem
        color="yellow"
        icon="heartCrack"
        to="/abandonner-votre-animal"
      >
        Abandonner votre animal
      </SubNavItem>
    </div>
  );
}
