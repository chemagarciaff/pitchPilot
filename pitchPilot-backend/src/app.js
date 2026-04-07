import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import scenariosRoutes from "./routes/scenarios.routes.js";
import simulationsRoutes from "./routes/simulations.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", authRoutes);
app.use("/api/scenarios", scenariosRoutes);
app.use("/api/simulations", simulationsRoutes);

export default app;