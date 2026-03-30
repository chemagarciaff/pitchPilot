export default function ScenarioCard({ scenario, onStart }) {
  return (
    <div className="card scenario-card">
      <div className="badge">{scenario.difficulty}</div>

      <h3>{scenario.title}</h3>
      <p className="muted">{scenario.description}</p>

      <div className="scenario-block">
        <strong>Cliente</strong>
        <p>{scenario.customerProfile}</p>
      </div>

      <div className="scenario-block">
        <strong>Inmueble</strong>
        <p>{scenario.propertyContext}</p>
      </div>

      <div className="scenario-actions">
        <button className="button" onClick={() => onStart(scenario.id)}>
          Iniciar simulación
        </button>
      </div>
    </div>
  );
}