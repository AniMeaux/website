import type { SubNavComponent } from "#core/layout/navigation/shared";
import { SubNavItem } from "#core/layout/navigation/shared";

export const SubNavDiscover: SubNavComponent = () => {
  return (
    <div className="flex flex-col">
      <SubNavItem color="blue" icon="handshake" to="/partenaires">
        Partenaires
      </SubNavItem>

      <SubNavItem
        color="cyan"
        icon="file-contract"
        to="/conventions-de-sterilisation"
      >
        Conventions de stérilisation
      </SubNavItem>

      <SubNavItem color="red" icon="newspaper" to="/articles-de-presse">
        Articles de presse
      </SubNavItem>

      <SubNavItem color="green" icon="pen-nib" to="/blog">
        Blog
      </SubNavItem>

      <SubNavItem color="yellow" icon="comments-question" to="/faq">
        FAQ
      </SubNavItem>
    </div>
  );
};

SubNavDiscover.isActive = (location) => {
  const pathname = location.pathname.toLowerCase();

  return ["/partenaires", "/blog", "/faq"].some((path) =>
    pathname.startsWith(path),
  );
};
