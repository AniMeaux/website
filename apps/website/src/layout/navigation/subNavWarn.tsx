import { SubNavComponent, SubNavItem } from "~/layout/navigation/shared";

export const SubNavWarn: SubNavComponent = () => {
  return (
    <div className="flex flex-col">
      <SubNavItem color="green" icon="catTree" to="/signaler-un-animal-errant">
        Signaler un animal errant
      </SubNavItem>

      <SubNavItem
        color="red"
        icon="sirenOn"
        to="/informer-d-un-acte-de-maltraitance"
      >
        Informer d’un acte de maltraitance
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
};

SubNavWarn.isActive = (location) => {
  const pathname = location.pathname.toLowerCase();

  return [
    "/signaler-un-animal-errant",
    "/informer-d-un-acte-de-maltraitance",
    "/abandonner-votre-animal",
  ].some((path) => pathname.startsWith(path));
};
