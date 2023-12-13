import { UserInterface } from "../../types/user"
import { loadingToast, sendToastUpdate } from "../../utils/toast"
import disabledButton from "../../utils/disabledButton"
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ setUser }: { setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>}) => {

    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonLogout = e.currentTarget

        const idToast = loadingToast("Cerrando sesión");

        disabledButton(buttonLogout, true)

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
        disabledButton(buttonLogout, false)
    }

    return (
        <button onClick={handleLogout} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Cerrar sesión</button>
    )
}

export default LogoutButton
