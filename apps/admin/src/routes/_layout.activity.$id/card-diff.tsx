import { Card } from "#core/layout/card.js";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { useLoaderData } from "@remix-run/react";
import { forwardRef } from "react";
import type { Except } from "type-fest";
import type { loader } from "./loader.server";

namespace DiffSection {
  export const Root = forwardRef<
    React.ComponentRef<typeof Primitive.section>,
    React.ComponentPropsWithoutRef<typeof Primitive.section>
  >(({ className, ...props }, ref) => {
    return (
      <Primitive.section
        {...props}
        ref={ref}
        className={cn("grid grid-cols-1", className)}
      />
    );
  });

  export const Title = forwardRef<
    React.ComponentRef<typeof Primitive.h3>,
    React.ComponentPropsWithoutRef<typeof Primitive.h3>
  >(({ className, ...props }, ref) => {
    return (
      <Primitive.h3
        {...props}
        ref={ref}
        className={cn("text-gray-500 text-caption-default", className)}
      />
    );
  });

  export const Code = forwardRef<
    React.ComponentRef<"pre">,
    Except<React.ComponentPropsWithoutRef<"pre">, "children"> & {
      code?: unknown;
    }
  >(({ className, code, ...props }, ref) => {
    return (
      <pre
        {...props}
        ref={ref}
        className={cn(
          "overflow-x-auto rounded-0.5 bg-gray-100 p-1 text-code-default",
          className,
        )}
      >
        <code>{code != null ? JSON.stringify(code, null, 2) : "N/A"}</code>
      </pre>
    );
  });
}

export function CardDiff() {
  const { activity } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Changements</Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="grid grid-cols-2 items-start gap-1 md:gap-2">
          <DiffSection.Root>
            <DiffSection.Title>Avant</DiffSection.Title>
            <DiffSection.Code code={activity.before} />
          </DiffSection.Root>

          <DiffSection.Root>
            <DiffSection.Title>Après</DiffSection.Title>
            <DiffSection.Code code={activity.after} />
          </DiffSection.Root>
        </div>
      </Card.Content>
    </Card>
  );
}
