import noteModel from "./models/notes.js"
import { NoteType, UpdateNoteType } from "../types/notes.js"

// Esta clase crea un objeto que manipula una colección en MongoDB con documentos dentro. Dichos documentos pueden ser agregados, modificados, borrados y consultados

class NoteContainer {
    model = noteModel

    constructor() {
        this.model = noteModel
    }

    async save(document: NoteType) { // Recibe un documento, lo guarda en la colección, le coloca un id único y devuelve ese id
        const save_ = await this.model.create(document)
        return save_._id.valueOf()
    }
    
    async getAll() { // Devuelve un array con todos los documentos presentes en la colección
        return await this.model.find({})
    }

    async updateById(id: string, documentoActualizado: UpdateNoteType) { // Actualiza un documento de la colección según su id
        await this.model.updateOne({_id: id}, {$set: {...documentoActualizado}})
    }

    async deleteById(id: string) { // Elimina de la base de datos al documento con el id solicitado
        await this.model.deleteOne({_id: id})
    }
}

export default NoteContainer
