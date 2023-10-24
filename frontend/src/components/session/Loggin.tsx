import { useContext } from "react";
import { PersonalContext } from "../PersonalContext";
import { Link, useNavigate } from "react-router-dom";
import { loadingToast, sendToast, sendToastUpdate } from "../../utils";
import disabledButton from "../../utils/disabledButton";

const Loggin = () => {
    const personalContext = useContext(PersonalContext);
    if (!personalContext) return null

    const { user } = personalContext

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget);

        const username = formData.get("loggin-username");
        const password = formData.get("loggin-password");
        
        if (!username || !password) {
            return sendToast("error", "Debe rellenar todos los campos")
        }

        const button = e.currentTarget.lastChild

        if (!(button instanceof HTMLButtonElement)) {
            return sendToast("error", "Error interno")
        }

        disabledButton(button, true)

        const idToast = loadingToast("Espere....");

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/login`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ username, password })
        })

        const json = await res.json()
        
        if (json.status === "success") {
            sendToastUpdate(idToast, "success", json.message)
            navigate("/")

        } else if (json.status === "error" && res.status !== 500) {
            sendToastUpdate(idToast, "error", json.error)
            disabledButton(button, false)
        
        } else {
            console.error("Error interno")
        }
    }

    if (user) return <h2 className='mt-8 text-center text-xl font-semibold'>Hay una sesión abierta! Si deseas loguearte con una cuenta distinta, por favor desloguéate primero</h2>

    return (
        <section className="w-full flex flex-col">
            <h2 className="my-5 text-2xl text-center font-semibold">Formulario de logueo</h2>

            <form onSubmit={handleSubmit} className="mx-auto max-w-lg p-2 flex flex-col border border-black rounded-sm">
                <div>
                    <label className="mr-2" htmlFor="loggin-username">Nombre de usuario</label>
                    <input className="px-1 border border-black rounded-sm" type="text" id="loggin-username" name="loggin-username" placeholder="Nombre de usuario" />
                </div>

                <div className="my-5">
                    <label className="mr-2" htmlFor="loggin-password">Contraseña</label>
                    <input className="px-1 border border-black rounded-sm" type="password" id="loggin-password" name="loggin-password" placeholder="****" />
                </div>

                <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" type="submit">Iniciar sesión</button>
            </form>

            <p className="mx-auto mt-4">No tienes una cuenta? <Link className="text-blue-700" to="/register">Regístrate</Link></p>
        </section>
    )
}

export default Loggin