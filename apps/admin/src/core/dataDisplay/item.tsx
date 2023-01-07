export function Item({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <li className="w-full rounded-0.5 grid grid-cols-[auto_minmax(0px,1fr)] grid-flow-col">
      <span className="w-4 h-4 flex items-center justify-center text-gray-600 text-[20px]">
        {icon}
      </span>

      <div className="py-1">{children}</div>
    </li>
  );
}
