import classNames from "classnames";

import "./heading.css";

export default function Heading({ level, size, color = "default", children }) {
  const HeadingTag = `h${level || 5}`;
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
