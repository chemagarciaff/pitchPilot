import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function HistoryPage() {
  const { user } = useAuth();
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadHistory();
    }
  }, [user]);

  async function loadHistory() {
    try {
      setLoading(true);
      const data = await api.getUserHistory(user.id);
      setSimulations(data);
    } catch (err) {
      setError(err.message || "No se pudo cargar el historial");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Historial de simulaciones">
      {loading ? (
        <Loader text="Cargando historial..." />
      ) : (
        <>
          {error && <div className="error-box mb-16">{error}</div>}

          <div className="card">
            {simulations.length === 0 ? (
              <div className="empty-state">Todavía no has realizado simulaciones.</div>
            ) : (
              <div className="history-list">
                {simulations.map((item) => (
                  <div key={item.id} className="history-item">
                    <div>
                      <h3>{item.scenario?.title}</h3>
                      <p className="muted">
                        Estado: {item.status} · Inicio:{" "}
                        {new Date(item.startedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="history-actions">
                      <span className="history-score">
                        {item.finalScore ?? "--"}
                      </span>

                      {item.evaluation ? (
                        <Link to={`/simulation/${item.id}/feedback`} className="button button-secondary">
                          Ver feedback
                        </Link>
                      ) : (
                        <Link to={`/simulation/${item.id}`} className="button">
                          Continuar
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}