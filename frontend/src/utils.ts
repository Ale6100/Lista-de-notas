import { toast } from 'react-toastify';

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

export const loadingToast = (message: string) => toast.loading(message)

export const sendToastUpdate = (id: number | string, type: "error" | "success", message: string) => {
    toast.update(id, {
        render: message,
        type,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        isLoading: false
    })
}
