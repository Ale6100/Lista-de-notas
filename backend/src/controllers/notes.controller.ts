import { randomUUID } from "crypto";
import NoteContainer from "../daos/NoteContainer.js";
import { Request, Response } from "express";

const Note = new NoteContainer()

const getAll = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        if (!id) {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.status(400).send({status: "error", error: "Valores incompletos"}) 
        }
        
        const notes = await Note.getById(id)

        return res.status(200).send({status: "success", payload: notes})        
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({status: "error", error })        
    }
}

const saveOneCategory = async (req: Request, res: Response) => { // En /api/notes/category/:id con el método POST, registra una nueva categoria en la base de datos al usuario con el id del params
    const { id } = req.params

    try {
        const { title } = req.body;

        if (!title || !id) {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.status(400).send({status: "error", error: "Valores incompletos"}) 
        }

        const note = await Note.save({ idUser: id, title, items: [] })
        return res.status(200).send({status: "success", payload: note})

    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({status: "error", error })         
    }
} 

const saveOneItem = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        const { id } = req.params

        if (!text || !id) {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.status(400).send({ status: "error", error: "Valores incompletos" }) 
        }

        const idItem = randomUUID()

        await Note.saveItem(id, text, idItem)
        return res.status(200).send({ status: "success", payload: idItem })

    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({ status: "error", error })         
    }
}

const deleteCategory = async (req: Request, res: Response) => { // En /api/notes/category/:id con el método DELETE, borra la categoria con el id del params
    try {
        const { id } = req.params

        if (!id) {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.status(400).send({ status: "error", error: "Valores incompletos" }) 
        }

        await Note.deleteById(id)
        return res.status(200).send({ status: "success", message: "Categoría eliminada" })

    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({ status: "error", error })         
    }
}

export default {
    getAll,
    saveOneCategory,
    saveOneItem,
    deleteCategory
}
