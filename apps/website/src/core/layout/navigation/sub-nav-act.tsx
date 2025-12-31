import type { SubNavComponent } from "#i/core/layout/navigation/shared";
import { SubNavItem } from "#i/core/layout/navigation/shared";

export const SubNavAct: SubNavComponent = () => {
  return (
    <div className="flex flex-col">
      <SubNavItem
        color="blue"
        icon="house-chimney-paw"
        to="/devenir-famille-d-accueil"
      >
        Devenir famille d’accueil
      </SubNavItem>

      <SubNavItem color="green" icon="people-group" to="/devenir-benevole">
        Devenir bénévole
      </SubNavItem>

      <SubNavItem color="yellow" icon="hand-holding-euro" to="/faire-un-don">
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
