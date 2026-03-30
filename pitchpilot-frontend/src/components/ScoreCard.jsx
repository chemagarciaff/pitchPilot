export default function ScoreCard({ label, value }) {
  return (
    <div className="score-card">
      <span className="score-label">{label}</span>
      <span className="score-value">{value}</span>
    </div>
  );
}