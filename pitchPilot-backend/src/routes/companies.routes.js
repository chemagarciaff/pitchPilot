import { Router } from "express";
import {
  getMyCompany
} from "../controllers/companies.controller.js";
import { simpleAuth } from "../middleware/simpleAuth.js";

const router = Router();

router.use(simpleAuth);

router.get("/", getMyCompany);

export default router;