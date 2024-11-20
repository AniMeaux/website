import { Icon } from "#generated/icon";
import {
  cn,
  createHookContext,
  useComposedRefs,
  useIsMounted,
} from "@animeaux/core";
import type { DataUrlFile } from "@animeaux/files-io";
import { readFile } from "@animeaux/files-io";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef, useRef, useState } from "react";
import type { Except } from "type-fest";

const [ContextProvider, useContext] = createHookContext(() => {
  const inputRef = useRef<React.ComponentRef<"input">>(null);

  const [state, setState] = useState<
    | { type: "idle" }
    | { type: "loading" }
    | { type: "error"; error: unknown }
    | { type: "success"; data: DataUrlFile }
  >({ type: "idle" });

  return { state, setState, inputRef };
});

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
          className={cn("grid aspect-4/3 grid-cols-1 rounded-2", className)}
        />
      </ContextProvider>
    );
  }),

  Input: forwardRef<
    React.ComponentRef<"input">,
    React.ComponentPropsWithoutRef<"input">
  >(function InputFileImageInput({ className, onChange, ...props }, propRef) {
    const { setState, inputRef } = useContext();

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

    const ref = useComposedRefs([propRef, inputRef]);

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
    Except<React.ComponentPropsWithoutRef<"img">, "src">
  >(function InputFileImagePreview({ alt, className, ...props }, ref) {
    const { state } = useContext();

    if (state.type !== "success") {
      return null;
    }

    return (
      <img
        {...props}
        ref={ref}
        src={state.data.dataUrl}
        alt={alt}
        className={cn(
          "pointer-events-none col-start-1 row-start-1 aspect-4/3 w-full rounded-[inherit] border border-mystic-200 object-contain can-hover:peer-focus-visible/input:focus-compact",
          className,
        )}
      />
    );
  }),

  Placeholder: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div>
  >(function InputFileImagePlaceholder({ className, ...props }, ref) {
    const { state } = useContext();

    if (state.type === "success") {
      return null;
    }

    return (
      <Primitive.div
        {...props}
        ref={ref}
        className={cn(
          "pointer-events-none col-start-1 row-start-1 grid grid-cols-1 items-center justify-items-center rounded-[inherit] border border-mystic-200 transition-colors duration-normal can-hover:peer-focus-visible/input:focus-compact",

          // Background.
          "bg-transparent peer-active/input:bg-mystic-100 can-hover:peer-hover/input:bg-mystic-50 peer-active/input:can-hover:peer-hover/input:bg-mystic-100",

          className,
        )}
      >
        <Icon id="upload-solid" className="text-mystic icon-64" />
      </Primitive.div>
    );
  }),
};
