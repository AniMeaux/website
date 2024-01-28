import { Routes } from "#core/navigation";

export function DownloadPictureLink({
  children,
  className,
  fileName,
  pictureId,
}: {
  children?: React.ReactNode;
  className?: string;
  fileName: string;
  pictureId: string;
}) {
  // We can't use a regular download anchor because of native UI not displayed
  // on iOS when the application is in standalone (installed).
  // https://developer.apple.com/forums/thread/95911
  return (
    <button
      onClick={() =>
        download(fileName, Routes.downloads.picture.id(pictureId).toString())
      }
      className={className}
    >
      {children}
    </button>
  );
}

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
