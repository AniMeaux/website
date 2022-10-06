import { Icon } from "~/generated/icon";

export function Helper({
  children,
  ...rest
}: Pick<React.HTMLAttributes<HTMLElement>, "id"> & {
  children?: React.ReactNode;
}) {
  return (
    <section
      {...rest}
      className="rounded-0.5 p-1 bg-red-50 flex items-start gap-1 text-red-500"
    >
      <Icon id="circleExclamation" className="flex-none text-[20px]" />
      <p className="flex-1 text-body-emphasis">{children}</p>
    </section>
  );
}
