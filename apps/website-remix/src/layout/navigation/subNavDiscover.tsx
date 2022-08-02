import { SubNavItem } from "~/layout/navigation/shared";

export function SubNavDiscover() {
  return (
    <div className="flex flex-col">
      <SubNavItem color="blue" icon="handshake" to="/partenaires">
        Partenaires
      </SubNavItem>

      <SubNavItem color="green" icon="newspaper" to="/blog">
        Blog
      </SubNavItem>

      <SubNavItem color="yellow" icon="commentsQuestion" to="/faq">
        FAQ
      </SubNavItem>
    </div>
  );
}
