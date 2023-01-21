import * as React from "react";

import classNames from "classnames";

import "./heading.css";

interface Headings {
  level?: 1 | 2 | 3 | 5 | 6,
  size?: string,
  color: string,
}
export default function Heading({ level, size, color = "default", children }: React.PropsWithChildren<Headings>) {
  const HeadingTag = `h${level || 5}` as const;
  const headingColor =
    color === "dark" ? "heading__text-dark" : "heading__text-default";

  return (
    <HeadingTag
      className={classNames("heading", headingColor)}
      style={{ fontSize: size }}
    >
      {children}
    </HeadingTag>
  );
}
