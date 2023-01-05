import "./meshContainer.css";

export default function MeshContainer({ children, size = "default", id = "" }) {
  const meshClass = `meshContainer ${size} ${id}`;
  return <div className={meshClass}>{children}</div>;
}
