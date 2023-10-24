import { UserInterface } from "../../types/user"
import { sendToast } from "../../utils"
import disabledButton from "../../utils/disabledButton"

const DisabledButton = ({ setUser }: { setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>}) => {
    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonLogout = e.currentTarget
        disabledButton(buttonLogout, true)

        sendToast("info", "Cerrando sesión...", 2000)

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
            sendToast("success", "Sesión cerrada!")
        
        } else {
            console.error("Error! Intente de nuevo más tarde")
        }
        disabledButton(buttonLogout, false)
    }        
    
    return (
        <button onClick={handleLogout} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Cerrar sesión</button>        
    )    
}

export default DisabledButton
