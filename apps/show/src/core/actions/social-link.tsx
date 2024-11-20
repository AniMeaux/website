import { Link } from "@remix-run/react";

export function SocialLink({
  children,
  ...rest
}: Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">) {
  return (
    <Link
      {...rest}
      className="grid grid-cols-1 rounded-full can-hover:focus-visible:focus-spaced"
    >
      {children}
    </Link>
  );
}
