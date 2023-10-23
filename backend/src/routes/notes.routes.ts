import { Router } from "express";
import notesController from "../controllers/notes.controller.js";

const router = Router();

// router.post("/register", sessionsController.register)

// router.post("/login", sessionsController.login)

router.get("/", notesController.getAll)

// router.get("/logout", sessionsController.logout)

export default router
