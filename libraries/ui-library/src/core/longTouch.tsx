import * as React from "react";

export function useLongTouch(onLongTouch: () => void) {
  const onLongTouchRef = React.useRef(onLongTouch);
  React.useEffect(() => {
    onLongTouchRef.current = onLongTouch;
  });

  const [isDown, setIsDown] = React.useState(false);

  React.useEffect(() => {
    if (isDown) {
      const timeoutId = setTimeout(() => onLongTouchRef.current(), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isDown]);

  function onTouchStart() {
    setIsDown(true);
  }

  function onTouchEnd() {
    setIsDown(false);
  }

  return {
    onTouchStart,
    onTouchEnd,
    onTouchMove: onTouchEnd,
  };
}
