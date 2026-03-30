import prisma from "../db.js";

export async function getScenarios(_req, res) {
  const scenarios = await prisma.scenario.findMany({
    orderBy: { id: "desc" },
  });

  res.json(scenarios);
}

export async function getScenario(req, res) {
  const id = Number(req.params.id);

  const scenario = await prisma.scenario.findUnique({
    where: { id },
  });

  if (!scenario) {
    return res.status(404).json({ message: "Escenario no encontrado" });
  }

  res.json(scenario);
}

export async function createScenario(req, res) {
  const scenario = await prisma.scenario.create({
    data: req.body,
  });

  res.status(201).json(scenario);
}

export async function updateScenario(req, res) {
  const id = Number(req.params.id);

  const scenario = await prisma.scenario.update({
    where: { id },
    data: req.body,
  });

  res.json(scenario);
}