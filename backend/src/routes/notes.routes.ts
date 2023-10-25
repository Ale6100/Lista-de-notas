import { Router } from "express";
import notesController from "../controllers/notes.controller.js";

const router = Router();

router.post("/category/:id", notesController.saveOneCategory)

router.post("/:id", notesController.saveOneItem) // Próximamente será /category/item/:id

router.get("/:id", notesController.getAllNotesById) // Próximamente /category/:id

router.delete("/category/:id", notesController.deleteCategory)

router.delete("/category/item/:id", notesController.deleteOneItem)

export default router
