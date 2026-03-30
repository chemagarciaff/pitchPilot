export default function Loader({ text = "Cargando...", fullPage = false }) {
  return (
    <div className={fullPage ? "loader-page" : "loader-inline"}>
      <div className="spinner" />
      <span>{text}</span>
    </div>
  );
}