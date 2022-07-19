import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn(className, "flex gap-1")}>
      <SocialLink
        to="https://www.facebook.com/animeaux.protectionanimale"
        icon="facebook"
        title="Page Facebook"
        className="hover:bg-[#3774dc] hover:text-[#3774dc]"
      />

      <SocialLink
        to="https://www.instagram.com/associationanimeaux"
        icon="instagram"
        title="Compte Instagram"
        className="hover:bg-[#ad3d7a] hover:text-[#ad3d7a]"
      />

      <SocialLink
        to="https://www.linkedin.com/company/ani-meaux"
        icon="linkedin"
        title="Page LinkedIn"
        className="hover:bg-[#2c66bc] hover:text-[#2c66bc]"
      />

      <SocialLink
        to="https://twitter.com/Ani_Meaux"
        icon="twitter"
        title="Compte Twitter"
        className="hover:bg-[#499be9] hover:text-[#499be9]"
      />
    </div>
  );
}

function SocialLink({
  icon,
  className,
  ...rest
}: BaseLinkProps & { icon: IconProps["id"] }) {
  return (
    <BaseLink
      {...rest}
      className={cn(
        className,
        "rounded-tl-xl rounded-tr-lg rounded-br-xl rounded-bl-lg bg-opacity-0 p-2 flex items-center text-gray-700 hover:bg-opacity-10 transition-colors duration-100 ease-in-out"
      )}
    >
      <Icon id={icon} />
    </BaseLink>
  );
}
