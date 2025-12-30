import { FileItem } from "#i/core/data-display/file-item";
import { cn, createHookContext } from "@animeaux/core";
import { forwardRef, useState } from "react";

export const InputFile = {
  Root: forwardRef<
    React.ComponentRef<typeof FileItem.Root>,
    React.ComponentPropsWithoutRef<typeof FileItem.Root>
  >(function InputFileRoot(props, ref) {
    return (
      <ContextProvider>
        <FileItem.Root {...props} ref={ref} />
      </ContextProvider>
    );
  }),

  Input: forwardRef<
    React.ComponentRef<"input">,
    React.ComponentPropsWithoutRef<"input">
  >(function InputFileInput({ className, onChange, ...props }, ref) {
    const { setState } = useContext();

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      onChange?.(event);

      const [firstFile] = event.currentTarget.files ?? [];

      // Handle native file input reset.
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#detecting_cancellations
      if (firstFile == null) {
        setState({ type: "empty" });
        return;
      }

      setState({ type: "filled", file: firstFile });
    }

    return (
      <input
        {...props}
        ref={ref}
        onChange={handleChange}
        className={cn(
          "peer/input col-start-1 row-start-1 h-full w-full cursor-pointer rounded-[inherit] opacity-0",
          className,
        )}
      />
    );
  }),

  Icon: forwardRef<
    React.ComponentRef<typeof FileItem.Icon>,
    React.ComponentPropsWithoutRef<typeof FileItem.Icon>
  >(function InputFileIcon({ className, ...props }, ref) {
    const { state } = useContext();

    return (
      <FileItem.Icon
        {...props}
        ref={ref}
        id={state.type === "empty" ? "upload-light" : undefined}
        mimeType={state.type === "filled" ? state.file.type : undefined}
        className={cn(
          "pointer-events-none transition-colors duration-normal can-hover:peer-focus-visible/input:focus-spaced",

          // Background.
          "bg-transparent peer-active/input:bg-mystic-100 can-hover:peer-hover/input:bg-mystic-50 peer-active/input:can-hover:peer-hover/input:bg-mystic-100",
          className,
        )}
      />
    );
  }),

  Thumbnail: forwardRef<
    React.ComponentRef<typeof FileItem.Thumbnail>,
    React.ComponentPropsWithoutRef<typeof FileItem.Thumbnail>
  >(function InputFilePreview({ className, ...props }, ref) {
    const { state } = useContext();

    if (state.type === "filled") {
      return null;
    }

    return (
      <FileItem.Thumbnail
        {...props}
        ref={ref}
        className={cn(
          "pointer-events-none transition-transform duration-slow can-hover:group-hover/item:scale-105",
          className,
        )}
      />
    );
  }),

  Filename: forwardRef<
    React.ComponentRef<typeof FileItem.Filename>,
    React.ComponentPropsWithRef<typeof FileItem.Filename>
  >(function InputFileFilename({ children, className, ...props }, ref) {
    const { state } = useContext();

    return (
      <FileItem.Filename
        {...props}
        ref={ref}
        className={cn("pointer-events-none", className)}
      >
        {state.type === "filled" ? state.file.name : children}
      </FileItem.Filename>
    );
  }),
};

const [ContextProvider, useContext] = createHookContext(() => {
  const [state, setState] = useState<
    { type: "empty" } | { type: "filled"; file: File }
  >({ type: "empty" });

  return { state, setState };
});
