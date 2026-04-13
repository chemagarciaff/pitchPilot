import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ScenarioCard from "../components/ScenarioRoute";
import { api } from "../api/client";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadScenarios();
    loadCompany();
  }, []);

  async function loadScenarios() {
    try {
      setLoading(true);
      const data = await api.getScenarios();
      setScenarios(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los escenarios");
    } finally {
      setLoading(false);
    }
  }

  async function loadCompany() {
    try {
      setLoading(true);
      const data = await api.getCompanyContext();
      setCompany(data);
    } catch (err) {
      setError(err.message || "No se pudo cargar el contexto de empresa");
    } finally {
      setLoading(false);
    }
  }

  async function handleStartScenario(scenarioId) {
    try {
      setStartingId(scenarioId);
      const simulation = await api.createSimulation(scenarioId);
      navigate(`/simulation/${simulation.id}`);
    } catch (err) {
      setError(err.message || "No se pudo iniciar la simulación");
    } finally {
      setStartingId(null);
    }
  }

  return (
    <Layout title="Escenarios disponibles" company={company}>
      {loading ? (
        <Loader text="Cargando escenarios..." />
      ) : (
        <>
          {error && <div className="error-box mb-16">{error}</div>}

          <div className="grid grid-3">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className={startingId === scenario.id ? "loading-card" : ""}>
                <ScenarioCard scenario={scenario} onStart={handleStartScenario} />
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}