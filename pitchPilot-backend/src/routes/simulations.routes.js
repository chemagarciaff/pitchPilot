import { Router } from "express";
import { simpleAuth } from "../middleware/simpleAuth.js";
import {
  startSimulation,
  getSimulation,
  sendMessage,
  endSimulation,
  getFeedback,
  getUserSimulations,
} from "../controllers/simulations.controller.js";

const router = Router();

router.use(simpleAuth);

router.post("/", startSimulation);
router.get("/:id", getSimulation);
router.post("/:id/messages", sendMessage);
router.post("/:id/end", endSimulation);
router.get("/:id/feedback", getFeedback);
router.get("/user/:userId/history", getUserSimulations);

export default router;