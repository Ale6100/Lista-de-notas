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

export default {
    getAll
}
