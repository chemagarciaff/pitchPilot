import { Router } from "express";
import { login, me } from "../controllers/auth.controller.js";
import { simpleAuth } from "../middleware/simpleAuth.js";

const router = Router();

router.post("/login", login);
router.get("/me", simpleAuth, me);

export default router;