import { UserInterface } from './types/user';
import { NoteType } from './types/note';

export const ordenarCategorias = (arrayCategorias: NoteType[], orderCategories: UserInterface["orderCategories"]) => {
    if (arrayCategorias.length === 0) return arrayCategorias

    if (orderCategories === "alphabetic") {
        arrayCategorias.sort((a: NoteType, b: NoteType) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()) {
                return -1
            } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return 1
            }
            return 0
        })

    } else if (orderCategories === "reverse alphabetic") {
        arrayCategorias.sort((a: NoteType, b: NoteType) => {
            if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return -1
            } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
                return 1
            }
            return 0
        })

    } else if (orderCategories === "more items") {
        arrayCategorias.sort((a: NoteType, b: NoteType) => {
            if (a.items.length > b.items.length) {
                return -1
            } else if (a.items.length < b.items.length) {
                return 1
            }
            return 0
        })
    } else if (orderCategories === "less items") {
        arrayCategorias.sort((a: NoteType, b: NoteType) => {
            if (a.items.length < b.items.length) {
                return -1
            } else if (a.items.length > b.items.length) {
                return 1
            }
            return 0
        })

    } else if (orderCategories === "date") {
        arrayCategorias.sort((a: NoteType, b: NoteType) => {
            if (a.timestamp > b.timestamp) {
                return -1
            } else if (a.timestamp < b.timestamp) {
                return 1
            }
            return 0
        })

    } else if (orderCategories === "reverse date") {
        arrayCategorias.sort((a: NoteType, b: NoteType) => {
            if (a.timestamp < b.timestamp) {
                return -1
            } else if (a.timestamp > b.timestamp) {
                return 1
            }
            return 0
        })
    } else {
        console.error("Error interno");
    }

    const notasFijadas = arrayCategorias.filter((note: NoteType) => note.fixed) // Esto hará que las notas fijadas aparezcan primero
    const notasNoFijadas = arrayCategorias.filter((note: NoteType) => !note.fixed)

    arrayCategorias = [...notasFijadas, ...notasNoFijadas]

    return arrayCategorias
}
