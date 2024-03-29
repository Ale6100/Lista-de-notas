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

    async saveItem(id: string, text: string, idItem: string) { // Recibe un documento, lo guarda en la colección, le coloca un id único y devuelve ese id
        await this.model.findOneAndUpdate({_id: id}, {$push: {items: {itemId: idItem, text}}})
    }

    async getById(id: string) { // Devuelve un array con todos los documentos presentes en la colección
        return await this.model.find({ idUser: id })
    }

    async updateById(id: string, documentoActualizado: UpdateNoteType) { // Actualiza un documento de la colección según su id
        await this.model.updateOne({_id: id}, {$set: {...documentoActualizado}})
    }

    async updateNote(id: string, idItem: string, text: string) { // Actualiza el text de una nota
        const category = await this.model.findOne({_id: id})
        if (!category) return null

        const newItems = category.items.map(item => {
            if (item.itemId === idItem) {
                item.text = text
            }
            return item
        })

        return await this.model.updateOne({_id: id}, {$set: {items: newItems}})
    }

    async updateTitleCategory(id: string, title: string) { // Actualiza el title de una categoria
        await this.model.updateOne({_id: id}, {$set: {title}})
    }

    async updateFixedCategory (id: string, fixed: boolean) { // Actualiza el fixed de una categoria
        await this.model.updateOne({_id: id}, {$set: {fixed}})
    }

    async deleteById(id: string) { // Elimina de la base de datos al documento con el id solicitado
        await this.model.deleteOne({_id: id})
    }

    async deleteByUserId(id: string) {
        await this.model.deleteMany({ idUser: id })
    }

    async deleteItem(id: string, idItem: string) { // Elimina de la base de datos al item con el id solicitado
        await this.model.findOneAndUpdate({_id: id}, {$pull: {items: {itemId: idItem}}})
    }
}

export default NoteContainer
