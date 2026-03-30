import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ScoreCard from "../components/ScoreCard";
import FeedbackCharts from "../components/FeedbackCharts";
import { api } from "../api/client";

export default function FeedbackPage() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFeedback();
  }, [id]);

  async function loadFeedback() {
    try {
      setLoading(true);
      const data = await api.getFeedback(id);
      setFeedback(data);
    } catch (err) {
      setError(err.message || "No se pudo cargar el feedback");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout title="Feedback">
        <Loader text="Cargando análisis..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Feedback">
        <div className="error-box">{error}</div>
      </Layout>
    );
  }

  const chartData = feedback.chartData || [];
  const strengths = feedback.strengths || [];
  const mistakes = feedback.mistakes || [];
  const recommendations = feedback.recommendations || [];

  return (
    <Layout title="Resultado de la simulación">
      <div className="feedback-top">
        <div className="card score-hero">
          <span className="score-hero-label">Puntuación total</span>
          <span className="score-hero-value">{feedback.scoreTotal}</span>
          <p className="muted">{feedback.summary}</p>
        </div>

        <div className="score-grid">
          <ScoreCard label="Discovery" value={feedback.scoreDiscovery} />
          <ScoreCard label="Empatía" value={feedback.scoreEmpathy} />
          <ScoreCard label="Objeciones" value={feedback.scoreObjection} />
          <ScoreCard label="Cierre" value={feedback.scoreClosing} />
        </div>
      </div>

      <FeedbackCharts chartData={chartData} />

      <div className="grid grid-3 mt-20">
        <div className="card">
          <h3>Fortalezas</h3>
          <ul className="list">
            {strengths.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Errores</h3>
          <ul className="list">
            {mistakes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Recomendaciones</h3>
          <ul className="list">
            {recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="page-actions">
        <Link to="/" className="button">
          Volver a escenarios
        </Link>
      </div>
    </Layout>
  );
}