import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { Icon, IconProps } from "~/generated/icon";

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn(className, "flex gap-1")}>
      <SocialLink
        to="https://www.facebook.com/salondesanimeaux"
        icon="facebook"
        title="Page Facebook"
        className="hover:bg-[#3774dc] hover:text-[#3774dc]"
      />

      <SocialLink
        to="https://www.instagram.com/salondesanimeaux"
        icon="instagram"
        title="Compte Instagram"
        className="hover:bg-[#ad3d7a] hover:text-[#ad3d7a]"
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
