import "./button.css";

import { CloseIcon } from '@/components/icons/Icons';

interface Button {
  children?: any,
  btnClass?: string,
  title?: string,
  props?: any[],
  handleClick?: React.MouseEventHandler<HTMLButtonElement>,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  onPointerDown?: React.MouseEventHandler<HTMLButtonElement>,
  onPointerUp?: React.MouseEventHandler<HTMLButtonElement>,
  onPointerLeave?: React.MouseEventHandler<HTMLButtonElement>,
}
function BaseButton({
  children,
  btnClass = "default",
  ...restProps
}: Readonly<Button>) {
  return (
    <button type='button' className={`btn ${btnClass}`} {...restProps}>
      {children}
    </button>
  );
}

export function ChevronDown({
  children,
  ...restProps
}: Readonly<Button>) {
  const btnClass = "btn-chevron";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
      <span className="chevron chevronDown">&#x25b2;</span>
    </BaseButton>
  );
}
export function ChevronUp({
  children,
  ...restProps
}: Readonly<Button>) {
  const btnClass = "btn-chevron";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
      <span className="chevron chevronUp">&#x25b2;</span>
    </BaseButton>
  );
}
export function Circular({
  children,
  ...restProps
}: Readonly<Button>) {
  const btnClass = "btn-circular";

  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
    </BaseButton>
  );
}

export function Close({
  children,
  ...restProps
}: Readonly<Button>) {
  const btnClass = "btn-close";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      <CloseIcon />
    </BaseButton>
  );
}

export function Default({
  children,
  ...restProps
}: Readonly<Button>) {
  return <BaseButton {...restProps}>{children}</BaseButton>;
}

export function Meter({
  children,
  ...restProps
}: Readonly<Button>) {
  const btnClass = "btn-tapper";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
    </BaseButton>
  );
}

export function Tapper({
  children,
  ...restProps
}: Readonly<Button>) {
  const btnClass = "btn-tapper";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
    </BaseButton>
  );
}

export function VolumeSettings({
  children,
  ...restProps
}: Readonly<Button>) {
  const btnClass = "btn-volume-settings";
  return (
    <BaseButton btnClass={btnClass} {...restProps}>
      {children}
    </BaseButton>
  );
}

