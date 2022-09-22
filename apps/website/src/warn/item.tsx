import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { DynamicImage } from "~/dataDisplay/image";

export function WarnItem({
  to,
  image,
  title,
  description,
}: {
  to: BaseLinkProps["to"];
  image: string;
  title: string;
  description: string;
}) {
  return (
    <li className="flex">
      <BaseLink
        to={to}
        className="group rounded-bubble-md w-full flex flex-col gap-3"
      >
        <DynamicImage
          imageId={image}
          alt={title}
          sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="w-full aspect-4/3 flex-none rounded-bubble-md"
        />

        <div className="flex flex-col">
          <p className="text-title-item transition-colors duration-100 ease-in-out group-hover:text-brandBlue">
            {title}
          </p>
          <p>{description}</p>
        </div>
      </BaseLink>
    </li>
  );
}
