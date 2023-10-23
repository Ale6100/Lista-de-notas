import mongoose from "mongoose";

const collection = 'notes'; // Nombre de la colección a manipular
const schema = new mongoose.Schema({ // Estructura que tendrá cada documento
    title: {
        type: String,
        required: true
    },

    items: {
        type: [
            {
                itemId: {
                    type: String,
                    required: true
                },
                text: {
                    type: String,
                    required: true
                }
            }
        ],
        required: true,
    }
})

const noteModel = mongoose.model(collection, schema);

export default noteModel;
