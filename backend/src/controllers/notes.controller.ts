import { randomUUID } from "crypto";
import NoteContainer from "../daos/NoteContainer.js";
import { Request, Response } from "express";

const Note = new NoteContainer()

const getAllNotesById = async (req: Request, res: Response) => {
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

        const timestamp = Date.now()

        const id_note = await Note.save({ idUser: id, title, items: [], timestamp })
        return res.status(200).send({status: "success", payload: { id: id_note, timestamp }})

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

const changeNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { itemId } = req.query
        const { text } = req.body  

        if (!id || !itemId || !text || typeof itemId !== "string" || typeof text !== "string") {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.status(400).send({ status: "error", error: "Valores incompletos" })
        }

        Note.updateNote(id, itemId, text)    

        return res.status(200).send({ status: "success", message: "Nota modificada" })
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({ status: "error", error })         
    }
}

const changeTitleCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { title } = req.body

        if (!id || !title || typeof title !== "string") {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.status(400).send({ status: "error", error: "Valores incompletos" })
        }

        await Note.updateTitleCategory(id, title)

        return res.status(200).send({ status: "success", message: "Título modificado" })
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

const deleteOneItem = async (req: Request, res: Response) => { // En /api/notes/:id con el método DELETE, borra el item con el id del params
    try {
        const { id } = req.params
        const { itemId } = req.query

        if (!id || !itemId || typeof itemId !== "string") {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.status(400).send({ status: "error", error: "Valores incompletos" }) 
        }
        
        await Note.deleteItem(id, itemId)
        return res.status(200).send({ status: "success", message: "Nota eliminada" })
        
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({ status: "error", error })         
    }        
}

export default {
    getAllNotesById,
    saveOneCategory,
    saveOneItem,
    changeNote,
    changeTitleCategory,
    deleteCategory,
    deleteOneItem,
}
