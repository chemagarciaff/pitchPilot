import { Router } from "express";
import {
  getScenarios,
  getScenario,
  createScenario,
  updateScenario,
} from "../controllers/scenarios.controller.js";
import { simpleAuth } from "../middleware/simpleAuth.js";

const router = Router();

router.use(simpleAuth);

router.get("/", getScenarios);
router.get("/:id", getScenario);
router.post("/", createScenario);
router.put("/:id", updateScenario);

export default router;