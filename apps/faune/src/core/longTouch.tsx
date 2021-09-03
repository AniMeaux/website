import { useEffect, useRef, useState } from "react";

export function useLongTouch(onLongTouch: () => void) {
  const onLongTouchRef = useRef(onLongTouch);
  useEffect(() => {
    onLongTouchRef.current = onLongTouch;
  });

  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
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
