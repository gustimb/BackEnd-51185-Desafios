import { Router } from "express";
import SessionsController from "../controllers/sessions.controller.js";
import { checkRole, checkAuthenticated, uploaderDocument } from "../middlewares/validations.js";

const router = Router();
const sessionsController = new SessionsController();

router.get('/', sessionsController.getUsersDTO);

router.get('/:uid', sessionsController.getUserByIdDTO);

router.post('/user-details', checkRole(["admin"]), sessionsController.userDetails);

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

router.delete('/', checkRole(["admin"]), sessionsController.deleteUserByLastConnection);

export default router;