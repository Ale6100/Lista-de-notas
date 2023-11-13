import { toast } from 'react-toastify';

export const sendToast = (type: "error" | "success" | "info", message: string, timeout = 4000) => {
    toast[type](message, {
        position: "top-right",
        autoClose: timeout,
        hideProgressBar: timeout ===  4000 ? false : true,
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

export const sendToastUpdate = (id: number | string, type: "error" | "success", message: string, autoClose = 4000) => {
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
