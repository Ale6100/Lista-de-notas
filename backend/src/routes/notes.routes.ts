import { Router } from "express";
import notesController from "../controllers/notes.controller.js";

const router = Router();

// Admito que las rutas son un desastre, luego tengo que reorganizarlas

router.post("/category/:id", notesController.saveOneCategory)

router.post("/category/item/:id", notesController.saveOneItem)

router.patch("/category/item/:id", notesController.changeNote)

router.patch("/category/fixed/:id", notesController.changeFixedCategory)

router.patch("/category/:id", notesController.changeTitleCategory)

router.get("/category/:id", notesController.getAllNotesById)

router.delete("/category/:id", notesController.deleteCategory)

router.delete("/category/item/:id", notesController.deleteOneItem)

export default router
