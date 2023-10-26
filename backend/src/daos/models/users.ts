import mongoose from "mongoose";

const collection = 'users'; // Nombre de la colección a manipular
const schema = new mongoose.Schema({ // Estructura que tendrá cada documento
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true     
    },

    orderCategories: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model(collection, schema);

export default userModel;
