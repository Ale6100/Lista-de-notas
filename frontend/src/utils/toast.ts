import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

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
        text: "No podrás reverlo!",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
        return result.isConfirmed
    })
}
