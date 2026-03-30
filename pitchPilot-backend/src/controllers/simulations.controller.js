import prisma from "../db.js";
import { generateClientReply, evaluateConversation } from "../services/ai.service.js";

export async function startSimulation(req, res) {
  const { scenarioId } = req.body;

  const simulation = await prisma.simulation.create({
    data: {
      userId: req.user.id,
      scenarioId,
      status: "ACTIVE",
    },
  });

  res.status(201).json(simulation);
}

export async function getSimulation(req, res) {
  const id = Number(req.params.id);

  const simulation = await prisma.simulation.findUnique({
    where: { id },
    include: {
      scenario: true,
      messages: {
        orderBy: { id: "asc" },
      },
      evaluation: true,
    },
  });

  if (!simulation) {
    return res.status(404).json({ message: "Simulación no encontrada" });
  }

  res.json(simulation);
}

export async function sendMessage(req, res) {
  const simulationId = Number(req.params.id);
  const { content } = req.body;

  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationId },
    include: {
      scenario: true,
      messages: {
        orderBy: { id: "asc" },
      },
    },
  });

  if (!simulation) {
    return res.status(404).json({ message: "Simulación no encontrada" });
  }

  if (simulation.status !== "ACTIVE") {
    return res.status(400).json({ message: "La simulación no está activa" });
  }

  await prisma.message.create({
    data: {
      simulationId,
      role: "USER",
      content,
    },
  });

  const updatedMessages = await prisma.message.findMany({
    where: { simulationId },
    orderBy: { id: "asc" },
  });

  const reply = await generateClientReply({
    scenario: simulation.scenario,
    messages: updatedMessages,
  });

  await prisma.message.create({
    data: {
      simulationId,
      role: "ASSISTANT",
      content: reply,
    },
  });

  res.json({ reply });
}

export async function endSimulation(req, res) {
  const simulationId = Number(req.params.id);

  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationId },
    include: {
      scenario: true,
      messages: {
        orderBy: { id: "asc" },
      },
    },
  });

  if (!simulation) {
    return res.status(404).json({ message: "Simulación no encontrada" });
  }

  const transcript = simulation.messages
    .map((m) => `${m.role === "USER" ? "COMERCIAL" : "CLIENTE"}: ${m.content}`)
    .join("\n");

  const feedback = await evaluateConversation({
    scenario: simulation.scenario,
    transcript,
  });

  await prisma.evaluation.create({
    data: {
      simulationId,
      scoreTotal: feedback.score_total,
      scoreDiscovery: feedback.scores.discovery,
      scoreEmpathy: feedback.scores.empathy,
      scoreObjection: feedback.scores.objection_handling,
      scoreClosing: feedback.scores.closing,
      strengths: feedback.strengths,
      mistakes: feedback.mistakes,
      recommendations: feedback.recommendations,
      chartData: feedback.chartData,
      summary: feedback.summary,
    },
  });

  await prisma.simulation.update({
    where: { id: simulationId },
    data: {
      status: "COMPLETED",
      endedAt: new Date(),
      finalScore: feedback.score_total,
      summary: feedback.summary,
    },
  });

  res.json(feedback);
}

export async function getFeedback(req, res) {
  const simulationId = Number(req.params.id);

  const evaluation = await prisma.evaluation.findUnique({
    where: { simulationId },
  });

  if (!evaluation) {
    return res.status(404).json({ message: "Feedback no encontrado" });
  }

  res.json(evaluation);
}

export async function getUserSimulations(req, res) {
  const userId = Number(req.params.userId);

  const simulations = await prisma.simulation.findMany({
    where: { userId },
    include: {
      scenario: true,
      evaluation: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  res.json(simulations);
}