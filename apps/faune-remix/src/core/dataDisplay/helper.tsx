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
      className="rounded-0.5 p-1 bg-red-50 grid grid-cols-[auto_1fr] items-start gap-1 text-red-500"
    >
      <Icon id="circleExclamation" className="text-[20px]" />
      <p className="text-body-emphasis">{children}</p>
    </section>
  );
}
