import { Router } from "express";
import sessionsController from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", sessionsController.register)

router.post("/login", sessionsController.login)

router.get("/current", sessionsController.current)

router.get("/logout", sessionsController.logout)

router.put("/changeOrderCategories/:id", sessionsController.changeOrderCategories)

router.delete("/deleteUser/:userId", sessionsController.deleteUser)

export default router
