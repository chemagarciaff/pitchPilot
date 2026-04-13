import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ title, company = null, children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">PitchPilot</div>
          <p className="brand-subtitle">Entrenador de ventas</p>

          <nav className="nav">
            <Link
              to="/"
              className={location.pathname === "/" ? "nav-link active" : "nav-link"}
            >
              Escenarios
            </Link>

            <Link
              to="/history"
              className={location.pathname === "/history" ? "nav-link active" : "nav-link"}
            >
              Historial
            </Link>

            <Link
              to="/scenarios/new"
              className={location.pathname === "/scenarios/new" ? "nav-link active" : "nav-link"}
            >
              Añadir escenario
            </Link>

            <Link
              to="/company"
              className={location.pathname === "/company" ? "nav-link active" : "nav-link"}
            >
              Company
            </Link>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-box">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="button button-secondary w-full" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          {company && <h3 className="company-kicker">Empresa {company.name}</h3>}

          <h1>{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}