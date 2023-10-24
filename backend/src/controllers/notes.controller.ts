import { randomUUID } from "crypto";
import NoteContainer from "../daos/NoteContainer.js";
import { Request, Response } from "express";

const Note = new NoteContainer()

const getAll = async (req: Request, res: Response) => {
    try {
        const notes = await Note.getAll()
        return res.status(200).send({status: "success", payload: notes})        
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({status: "error", error })        
    }
}

const saveOneCategory = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;

        if (!title) {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.status(400).send({status: "error", error: "Valores incompletos"}) 
        }

        const note = await Note.save({ title, items: [] })
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

export default {
    getAll,
    saveOneCategory,
    saveOneItem
}
