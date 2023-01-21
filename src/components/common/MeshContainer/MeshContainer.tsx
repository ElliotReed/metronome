
import "./meshContainer.css";

interface Props {
  size?: string,
  id?: string,
}
export default function MeshContainer({
  children,
  size = "default",
  id = "",
}: React.PropsWithChildren<Props>) {
  const meshClass = `meshContainer ${size} ${id}`;
  return <div className={meshClass}>{children}</div>;
}
