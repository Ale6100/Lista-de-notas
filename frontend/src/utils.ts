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

