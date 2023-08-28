import { Router } from "express";
import SessionsController from "../controllers/sessions.controller.js";
import { checkRole, checkAuthenticated, uploaderDocument} from "../middlewares/validations.js";


const router = Router();
const sessionsController = new SessionsController();

router.put("/premium/:uid", checkRole(["admin", "user", "premium"]), sessionsController.ChangeUserRole);

router.put("/:uid/documents",
    checkAuthenticated,
    uploaderDocument.fields([
        { name: "identificacion", maxCount: 1 },
        { name: "domicilio", maxCount: 1 },
        { name: "estadoDeCuenta", maxCount: 1 }]),
    sessionsController.updateUserDocument
);

router.delete("/:uid", checkRole(["user", "premium", "admin"]), sessionsController.deleteUserById);

export default router;