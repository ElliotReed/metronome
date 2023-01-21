import classNames from "classnames";

import "./heading.css";

interface Headings {
  level?: string,
  size?: string,
  color: string,
  children: any,
}
export default function Heading({ level, size, color = "default", children }:Headings) {
  const HeadingTag:string = `h${level || 5}`;
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
