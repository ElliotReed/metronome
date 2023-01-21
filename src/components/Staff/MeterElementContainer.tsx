interface Props {
  showState: boolean,
}
export default function MeterElementContainer({ children, showState }: React.PropsWithChildren<Props>) {
  const meterElementClass = `MeterElementContainer ${showState ? "show" : ""}`;

  return <div className={meterElementClass}>{children}</div>;
}