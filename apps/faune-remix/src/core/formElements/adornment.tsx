export function Adornment({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-2 h-2 flex items-center justify-center text-[14px] text-gray-600">
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
      className="w-2 h-2 flex items-center justify-center text-[14px] text-gray-600 pointer-events-auto cursor-pointer transition-colors duration-100 ease-in-out hover:text-inherit"
    >
      {children}
    </button>
  );
}
