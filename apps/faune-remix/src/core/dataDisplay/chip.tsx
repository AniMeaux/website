export function Chip({ children }: { children?: React.ReactNode }) {
  return (
    <span className="rounded-0.5 px-0.5 flex bg-gray-100 text-caption-emphasis">
      {children}
    </span>
  );
}
