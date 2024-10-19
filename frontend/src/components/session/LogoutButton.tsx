import { UserInterface } from "../../types/user"
import { loadingToast, sendToastUpdate } from "../../utils/toast"
import { disableButton, enableButton } from "../../utils/disabledButton"
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ setUser }: { setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>}) => {

    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonLogout = e.currentTarget

        const idToast = loadingToast("Cerrando sesión");

        disableButton(buttonLogout)

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/logout`, {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
            }
        })

        const json = await res.json()

        if (json.status === "success") {
            setUser(null)
            sendToastUpdate(idToast, "success", "Sesión cerrada!")

        } else {
            sendToastUpdate(idToast, "error", "Error! Intente de nuevo más tarde")
        }

        navigate("/login")
        enableButton(buttonLogout)
    }

    return (
        <button onClick={handleLogout} className='bg-red-500 hover:bg-red-700 font-bold text-slate-900 py-2 px-4 rounded'>Cerrar sesión</button>
    )
}

export default LogoutButton
