export function Card({ children }: { children?: React.ReactNode }) {
  return <section className="bg-white flex flex-col">{children}</section>;
}

export function CardHeader({ children }: { children?: React.ReactNode }) {
  return <header className="p-1 flex gap-1 md:p-2 md:gap-2">{children}</header>;
}

export function CardTitle({ children }: { children?: React.ReactNode }) {
  return (
    <h2 className="flex-1 text-title-section-small md:text-title-section-large">
      {children}
    </h2>
  );
}

export function CardContent({ children }: { children?: React.ReactNode }) {
  return (
    <div className="px-1 flex flex-col first:pt-1 last:pb-1 md:px-2 md:first:pt-2 md:last:pb-2">
      {children}
    </div>
  );
}
