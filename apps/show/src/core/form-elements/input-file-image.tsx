import { DynamicImage } from "#core/data-display/image";
import { Icon } from "#generated/icon";
import { ImageUrl, cn, createHookContext, useIsMounted } from "@animeaux/core";
import type { DataUrlFile } from "@animeaux/files-io";
import { readFile } from "@animeaux/files-io";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef, useState } from "react";
import type { Except } from "type-fest";

export const InputFileImage = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div>
  >(function InputFileImageRoot({ className, ...props }, ref) {
    return (
      <ContextProvider>
        <Primitive.div
          {...props}
          ref={ref}
          className={cn(
            "group/item grid aspect-4/3 grid-cols-1 rounded-2",
            className,
          )}
        />
      </ContextProvider>
    );
  }),

  Input: forwardRef<
    React.ComponentRef<"input">,
    React.ComponentPropsWithoutRef<"input">
  >(function InputFileImageInput({ className, onChange, ...props }, ref) {
    const { setState } = useContext();

    const isMounted = useIsMounted();

    async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      onChange?.(event);

      const [firstFile] = event.currentTarget.files ?? [];

      // Handle native file input reset.
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#detecting_cancellations
      if (firstFile == null) {
        setState({ type: "idle" });
        return;
      }

      setState({ type: "loading" });

      try {
        const data = await readFile(firstFile);

        if (isMounted.current) {
          setState({ type: "success", data });
        }
      } catch (error) {
        if (isMounted.current) {
          setState({ type: "error", error });
        }
      }
    }

    return (
      <input
        {...props}
        ref={ref}
        onChange={handleChange}
        className={cn(
          "peer/input col-start-1 row-start-1 aspect-4/3 w-full cursor-pointer rounded-[inherit] opacity-0",
          className,
        )}
      />
    );
  }),

  Preview: forwardRef<
    React.ComponentRef<"img">,
    Except<React.ComponentPropsWithoutRef<"img">, "src" | "alt">
  >(function InputFileImagePreview({ className, ...props }, ref) {
    const { state } = useContext();

    if (state.type !== "success") {
      return null;
    }

    return (
      <div className="pointer-events-none col-start-1 row-start-1 grid grid-cols-1 overflow-hidden rounded-[inherit] border border-mystic-200 can-hover:peer-focus-visible/input:focus-compact">
        <img
          {...props}
          ref={ref}
          src={state.data.dataUrl}
          alt={state.data.file.name}
          className={cn(
            "aspect-4/3 w-full rounded-[inherit] object-cover transition-transform duration-slow can-hover:group-hover/item:scale-105",
            className,
          )}
        />
      </div>
    );
  }),

  Placeholder: function InputFileImagePlaceholder({
    defaultLogo,
  }: {
    defaultLogo?: { path: string; alt: string };
  }) {
    const { state } = useContext();

    if (state.type === "success") {
      return null;
    }

    if (defaultLogo != null) {
      return (
        <div className="pointer-events-none col-start-1 row-start-1 grid grid-cols-1 overflow-hidden rounded-[inherit] border border-mystic-200 can-hover:peer-focus-visible/input:focus-compact">
          <DynamicImage
            alt={defaultLogo.alt}
            aspectRatio="4:3"
            fallbackSize="512"
            image={ImageUrl.parse(defaultLogo.path)}
            objectFit="cover"
            sizes={{ default: "100vw", md: "33vw", lg: "400px" }}
            loading="eager"
            className="w-full transition-transform duration-slow can-hover:group-hover/item:scale-105"
          />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "pointer-events-none col-start-1 row-start-1 grid grid-cols-1 items-center justify-items-center rounded-[inherit] border border-mystic-200 transition-colors duration-normal can-hover:peer-focus-visible/input:focus-compact",

          // Background.
          "bg-transparent peer-active/input:bg-mystic-100 can-hover:peer-hover/input:bg-mystic-50 peer-active/input:can-hover:peer-hover/input:bg-mystic-100",
        )}
      >
        <Icon id="upload-solid" className="text-mystic icon-64" />
      </div>
    );
  },
};

const [ContextProvider, useContext] = createHookContext(() => {
  const [state, setState] = useState<
    | { type: "idle" }
    | { type: "loading" }
    | { type: "error"; error: unknown }
    | { type: "success"; data: DataUrlFile }
  >({ type: "idle" });

  return { state, setState };
});
