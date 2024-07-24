import { Link } from "@remix-run/react";

export function SocialLink({
  children,
  ...rest
}: Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">) {
  return (
    <Link
      {...rest}
      className="grid grid-cols-1 rounded-full transition-transform duration-100 ease-in-out active:scale-95 focus-visible:focus-spaced-prussianBlue hover:scale-105 hover:active:scale-95"
    >
      {children}
    </Link>
  );
}
