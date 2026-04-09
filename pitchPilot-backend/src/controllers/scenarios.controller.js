import prisma from "../db.js";

export async function getScenarios(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { companyId: true },
  });

  const scenarios = await prisma.scenario.findMany({
    where: {
      companyId: user.companyId,
    },
    orderBy: { id: "desc" },
  });

  res.json(scenarios);
}

export async function getScenario(req, res) {
  const id = Number(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { companyId: true },
  });

  const scenario = await prisma.scenario.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },
  });

  if (!scenario) {
    return res.status(404).json({ message: "Escenario no encontrado" });
  }

  res.json(scenario);
}

export async function createScenario(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { companyId: true },
  });

  const scenario = await prisma.scenario.create({
    data: {
      companyId: user.companyId,
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      customerProfile: req.body.customerProfile,
      propertyContext: req.body.propertyContext,
      objections: req.body.objections,
      successCriteria: req.body.successCriteria,
    },
  });

  res.status(201).json(scenario);
}

export async function updateScenario(req, res) {
  const id = Number(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { companyId: true },
  });

  const existing = await prisma.scenario.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },
  });

  if (!existing) {
    return res.status(404).json({ message: "Escenario no encontrado" });
  }

  const scenario = await prisma.scenario.update({
    where: { id },
    data: {
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      customerProfile: req.body.customerProfile,
      propertyContext: req.body.propertyContext,
      objections: req.body.objections,
      successCriteria: req.body.successCriteria,
    },
  });

  res.json(scenario);
}