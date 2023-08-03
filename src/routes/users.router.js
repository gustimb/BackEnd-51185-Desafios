import { Router } from "express";
import SessionsController from "../controllers/sessions.controller.js";
import { checkRole } from "../middlewares/validations.js";

const router = Router();
const sessionsController = new SessionsController();

router.put("/premium/:uid", checkRole(["admin"]), sessionsController.getUserById);

export default router;