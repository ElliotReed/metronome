import * as React from 'react';

export default function useOutsideAlerter(ref: React.RefObject<any>, callback: () => void) {
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current || ref.current.contains(e.target)) return;
      callback();
    }
    document.addEventListener("mousedown", handleClickOutside, false);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, false);
    };
  }, [ref, callback]);
}

