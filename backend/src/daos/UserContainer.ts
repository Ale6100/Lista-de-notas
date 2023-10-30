import userModel from "./models/users.js"
import { UserType, UserTypeMongo } from "../types/users.js"

// Esta clase crea un objeto que manipula una colección en MongoDB con documentos dentro. Dichos documentos pueden ser agregados, modificados, borrados y consultados

class UserContainer {
    model = userModel

    constructor() {
        this.model = userModel
    }

    async save(document: UserType) { // Recibe un documento, lo guarda en la colección, le coloca un id único y devuelve ese id
        const save_ = await this.model.create(document)
        return save_._id.valueOf()
    }
    
    async getByUsername(username: string) { // Devuelve un documentos según su username
        return await this.model.findOne({ username }) as UserTypeMongo
    }

    async getById(id: string) { // Devuelve un documentos según su id
        return await this.model.findOne({ _id: id }) as UserTypeMongo
    }

    async updateOrderCategories(id: string, orderCategories: string) { // Actualiza el orderCategories de un usuario
        await this.model.updateOne({ _id: id }, { $set: { orderCategories } })
    }

    async deleteById(id: string) { // Elimina de la base de datos al documento con el id solicitado
        await this.model.deleteOne({ _id: id })
    }
}

export default UserContainer
