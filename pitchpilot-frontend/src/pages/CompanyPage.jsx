import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import { api } from "../api/client";

export default function CompanyPage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

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

  if (loading) {
    return (
      <Layout title="Contexto de empresa">
        <Loader text="Cargando contexto..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Contexto de empresa">
        <div className="error-box">{error}</div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout title="Contexto de empresa">
        <div className="error-box">No se encontró información de empresa</div>
      </Layout>
    );
  }

  return (
    <Layout title="Contexto de empresa">
      <div className="company-grid">
        <section className="card company-hero">
          <span className="section-kicker">Empresa</span>
          <h2>{company.name}</h2>
          <p className="muted">{company.businessDescription}</p>
        </section>

        <section className="card">
          <h3>Cliente objetivo</h3>
          <p>{company.targetCustomer}</p>
        </section>

        <section className="card">
          <h3>Proceso comercial</h3>
          <p>{company.salesProcess}</p>
        </section>

        <section className="card">
          <h3>Propuesta de valor</h3>
          <p>{company.valueProposition}</p>
        </section>

        <section className="card">
          <h3>Tono comercial</h3>
          <p>{company.toneGuidelines}</p>
        </section>

        <section className="card">
          <h3>Objeciones habituales</h3>
          <ul className="list">
            {(company.commonObjections || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3>Competidores o alternativas</h3>
          <ul className="list">
            {(company.competitors || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3>Objetivos comerciales</h3>
          <ul className="list">
            {(company.goals || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}