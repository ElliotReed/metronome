import * as React from "react";

import { useOutsideAlerter } from '@/hooks';

interface Props {
  callback: () => void;
}

export default function OutsideAlerter({ children, callback }
  : React.PropsWithChildren<Props>) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, callback);

  return (
    <div ref={wrapperRef} className="OutsideAlerter">
      {children}
    </div>
  );
}