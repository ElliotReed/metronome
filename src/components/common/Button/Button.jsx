import "./button.css";

function BaseButton({ children, btnClass = "default", ...restProps }) {
  return (
    <button className={`btn ${btnClass}`} {...restProps}>
      {children}
    </button>
  );
}

export function ChevronDown({ children, ...restProps }) {
  const btnClass = "btn-chevron ";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
      <span className="chevron chevronDown">&#x25b2;</span>
    </BaseButton>
  );
}
export function ChevronUp({ children, ...restProps }) {
  const btnClass = "btn-chevron";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
      <span className="chevron chevronUp">&#x25b2;</span>
    </BaseButton>
  );
}
export function Circular({ children, ...restProps }) {
  const btnClass = "btn-circular";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
    </BaseButton>
  );
}

export function Close({ children, ...restProps }) {
  const btnClass = "btn-circular";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
    </BaseButton>
  );
}

export function Default({ children, ...restProps }) {
  return <BaseButton {...restProps}>{children}</BaseButton>;
}

export function Meter({ children, ...restProps }) {
  const btnClass = "btn-tapper";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
    </BaseButton>
  );
}
export function Tapper({ children, ...restProps }) {
  const btnClass = "btn-tapper";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
    </BaseButton>
  );
}
