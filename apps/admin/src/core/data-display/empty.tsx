import { cn, createHookContext } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const Empty = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.section>,
    React.ComponentPropsWithoutRef<typeof Primitive.section> & {
      isCompact?: boolean;
    }
  >(function EmptyRoot({ isCompact = false, className, ...props }, ref) {
    return (
      <ContextProvider isCompact={isCompact}>
        <Primitive.section
          {...props}
          ref={ref}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-4 p-2",
            className,
          )}
        />
      </ContextProvider>
    );
  }),

  Icon: forwardRef<
    React.ComponentRef<typeof Primitive.span>,
    React.ComponentPropsWithoutRef<typeof Primitive.span>
  >(function EmptyIcon({ className, ...props }, ref) {
    const { isCompact } = useContext();

    return (
      <Primitive.span
        {...props}
        ref={ref}
        className={cn(
          "leading-none icon-80",
          isCompact ? undefined : "md:icon-120",
          className,
        )}
      />
    );
  }),

  Content: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div>
  >(function EmptyContent({ className, ...props }, ref) {
    return (
      <Primitive.div
        {...props}
        ref={ref}
        className={cn(
          "flex max-w-[400px] flex-col gap-2 text-center",
          className,
        )}
      />
    );
  }),

  Title: forwardRef<
    React.ComponentRef<typeof Primitive.h1>,
    React.ComponentPropsWithoutRef<typeof Primitive.h1>
  >(function EmptyTitle({ className, ...props }, ref) {
    const { isCompact } = useContext();

    return (
      <Primitive.h1
        {...props}
        ref={ref}
        className={cn(
          "text-title-section-small",
          isCompact ? undefined : "md:text-title-section-large",
          className,
        )}
      />
    );
  }),

  Message: Primitive.p,
};

const [ContextProvider, useContext] = createHookContext(
  ({ isCompact }: { isCompact: boolean }) => ({ isCompact }),
);

export function SimpleEmpty({
  icon,
  iconAlt,
  title,
  message,
  action,
  isCompact = false,
  titleElementType: TitleElementType = "h1",
  className,
}: {
  icon: string;
  iconAlt: string;
  title: string;
  message: React.ReactNode;
  action?: React.ReactNode;
  isCompact?: boolean;
  titleElementType?: React.ElementType;
  className?: string;
}) {
  return (
    <Empty.Root isCompact={isCompact} className={className}>
      <Empty.Icon role="img" aria-label={iconAlt} title={iconAlt}>
        {icon}
      </Empty.Icon>

      <Empty.Content>
        <Empty.Title asChild>
          <TitleElementType>{title}</TitleElementType>
        </Empty.Title>

        <Empty.Message>{message}</Empty.Message>
      </Empty.Content>

      {action}
    </Empty.Root>
  );
}
