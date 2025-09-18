import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const DownloadTrigger = forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  React.ComponentPropsWithoutRef<typeof Primitive.button> & {
    fileName: string;
    url: string;
  }
>(function DownloadTrigger({ className, fileName, url, ...props }, ref) {
  // We can't use a regular download anchor because of native UI not displayed
  // on iOS when the application is in standalone (installed).
  // https://developer.apple.com/forums/thread/95911
  return (
    <Primitive.button
      {...props}
      ref={ref}
      onClick={(event) => {
        props.onClick?.(event);

        if (!event.isDefaultPrevented()) {
          download(fileName, url);
        }
      }}
    />
  );
});

function download(fileName: string, url: string) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";

  xhr.onload = function onLoad() {
    if (this.status === 200) {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(this.response);
      link.download = fileName;
      link.click();
    }
  };

  xhr.send();
}
