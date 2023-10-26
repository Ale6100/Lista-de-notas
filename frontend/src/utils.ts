import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { UserInterface } from './types/user';
import { NoteType } from './types/note';

export const sendToast = (type: "error" | "success" | "info", message: string, timeout = 5000) => {
    toast[type](message, {
        position: "top-right",
        autoClose: timeout,
        hideProgressBar: timeout ===  5000 ? false : true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}

export const loadingToast = (message: string) => toast.loading(message, {
    theme: "dark",
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
})

export const sendToastUpdate = (id: number | string, type: "error" | "success", message: string, autoClose = 5000) => {
    toast.update(id, {
        render: message,
        type,
        position: "top-right",
        autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        isLoading: false
    })
}

export const swalSeguro = async () => {
    return await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
        return result.isConfirmed
    })
}

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

    return arrayCategorias
}
