import { SubNavItem } from "~/layout/navigation/shared";

export function SubNavAct() {
  return (
    <div className="flex flex-col">
      <SubNavItem
        color="blue"
        icon="houseChimneyPaw"
        to="/devenir-famille-d-accueil"
      >
        Devenir famille d'accueil
      </SubNavItem>

      <SubNavItem color="green" icon="peopleGroup" to="/devenir-benevole">
        Devenir bénévole
      </SubNavItem>

      <SubNavItem color="yellow" icon="handHoldingEuro" to="/faire-un-don">
        Faire un don
      </SubNavItem>
    </div>
  );
}
