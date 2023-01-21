import * as React from "react";

import * as Button from "../Button";
import Heading from "../Heading";
import "./collapsible.css";

interface Collapsible {
  shouldExpand: boolean,
  children: any,
  title?: string,
  titleColor: string
}
export default function Collapsible({ shouldExpand, children, title, titleColor }: Collapsible) {
  const [isExpanded,
    setIsExpanded] = React.useState<boolean>(shouldExpand);
  const [height,
    setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement | null>(null);

  const handleExpansion = () => {
    setIsExpanded((prev) => !prev);
    console.log(ref.current
      ?.getBoundingClientRect().height)
  };

  React.useEffect(() => {
    if (!height || !isExpanded || !ref.current)
      return undefined;

    const resizeObserver = new ResizeObserver((el) => {
      setHeight(el[0].contentRect.height);
    });

    resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [height, isExpanded]);

  React.useEffect(() => {
    if (!ref.current)
      return;
    if (isExpanded)
      setHeight(ref.current.getBoundingClientRect().height);
    else
      setHeight(0);
  }
    , [isExpanded]);

  const buttonText = (
    <Heading level="5" color={titleColor}>
      {title}
    </Heading>
  );

  return (
    <>
      <header className="collapsible__header">
        {!isExpanded
          ? (
            <Button.ChevronDown onClick={handleExpansion}>
              {title}
            </Button.ChevronDown>
          )
          : (
            <Button.ChevronUp onClick={handleExpansion}>
              {title}
            </Button.ChevronUp>
          )}
      </header>
      <div style={{ height }} className="collapsible">
        <div ref={ref}>{children}</div>
      </div>
    </ >
  );
}
