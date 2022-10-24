import { cn } from "~/core/classNames";

export function Adornment({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-3 h-3 flex-none flex items-center justify-center text-gray-600">
      {children}
    </span>
  );
}

export function ActionAdornment({
  onClick,
  children,
}: Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full w-3 h-3 flex-none flex items-center justify-center text-gray-600 pointer-events-auto cursor-pointer transition-colors duration-100 ease-in-out hover:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400"
    >
      {children}
    </button>
  );
}

export function AdornmentContainer({
  side,
  children,
}: {
  side: "left" | "right";
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "absolute top-0 p-0.5 flex items-center pointer-events-none",
        {
          "left-0": side === "left",
          "right-0": side === "right",
        }
      )}
    >
      {children}
    </span>
  );
}
