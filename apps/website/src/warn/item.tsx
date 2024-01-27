import type { BaseLinkProps } from "#core/baseLink.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { DynamicImage } from "#core/dataDisplay/image.tsx";

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
        className="group flex w-full flex-col gap-3 rounded-bubble-md"
      >
        <DynamicImage
          imageId={image}
          alt={title}
          sizes={{ lg: "300px", md: "30vw", xs: "50vw", default: "100vw" }}
          fallbackSize="512"
          className="aspect-4/3 w-full flex-none rounded-bubble-md"
        />

        <div className="flex flex-col">
          <p className="transition-colors duration-100 ease-in-out text-title-item group-hover:text-brandBlue">
            {title}
          </p>
          <p>{description}</p>
        </div>
      </BaseLink>
    </li>
  );
}
