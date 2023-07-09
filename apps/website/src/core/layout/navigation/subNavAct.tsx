import { SubNavComponent, SubNavItem } from "~/core/layout/navigation/shared";

export const SubNavAct: SubNavComponent = () => {
  return (
    <div className="flex flex-col">
      <SubNavItem
        color="blue"
        icon="houseChimneyPaw"
        to="/devenir-famille-d-accueil"
      >
        Devenir famille d’accueil
      </SubNavItem>

      <SubNavItem color="green" icon="peopleGroup" to="/devenir-benevole">
        Devenir bénévole
      </SubNavItem>

      <SubNavItem color="yellow" icon="handHoldingEuro" to="/faire-un-don">
        Faire un don
      </SubNavItem>
    </div>
  );
};

SubNavAct.isActive = (location) => {
  const pathname = location.pathname.toLowerCase();

  return [
    "/devenir-famille-d-accueil",
    "/devenir-benevole",
    "/faire-un-don",
  ].some((path) => pathname.startsWith(path));
};
