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
}

export default UserContainer
