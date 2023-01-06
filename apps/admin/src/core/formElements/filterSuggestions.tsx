import { Icon } from "~/generated/icon";

export function Suggestions({ children }: { children?: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

export function Suggestion({ children }: { children?: React.ReactNode }) {
  return (
    <label className="group relative z-0 rounded-0.5 grid grid-cols-[auto_minmax(0px,1fr)_auto] items-start cursor-pointer focus-within:z-10">
      {children}
    </label>
  );
}

export function SuggestionInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="peer appearance-none absolute -z-10 top-0 left-0 w-full h-full rounded-0.5 cursor-pointer transition-colors duration-100 ease-in-out group-hover:bg-gray-100 checked:bg-gray-100 focus-visible:outline-none focus-visible:ring-outset focus-visible:ring focus-visible:ring-blue-400"
    />
  );
}

export function SuggestionLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <>
      <span className="h-4 w-4 flex items-center justify-center text-gray-600 text-[20px]">
        {icon}
      </span>

      <span className="py-1 text-body-default peer-checked:text-body-emphasis">
        {children}
      </span>

      <span className="opacity-0 h-4 w-4 flex items-center justify-center text-green-600 transition-opacity duration-100 ease-in-out peer-checked:opacity-100">
        <Icon id="check" />
      </span>
    </>
  );
}
