import { useContext } from "react";
import { PersonalContext } from "../PersonalContext";
import { loadingToast, sendToast, sendToastUpdate } from "../../utils/toast";
import { useNavigate, Link } from "react-router-dom";
import disabledButton from "../../utils/disabledButton";

const Register = () => {
    const personalContext = useContext(PersonalContext);
    if (!personalContext) return null

    const { user } = personalContext
    
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const formData = new FormData(e.currentTarget)
        
        const username = formData.get("register-username")?.toString().trim()
        const password = formData.get("register-password")?.toString().trim()

        if (!username || !password) {
            return sendToast("error", "Debe rellenar todos los campos")
        }

        const button = e.currentTarget.lastChild

        if (!(button instanceof HTMLButtonElement)) {
            return sendToast("error", "Error interno")
        }

        disabledButton(button, true)

        const idToast = loadingToast("Espere....");

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/register`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        })

        const json = await res.json()

        if (json.status === "success") {
            sendToastUpdate(idToast, "success", "Registro exitoso! Ahora por favor logueate")
            navigate("/login")
        
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
            <h2 className="my-5 text-2xl text-center font-semibold">Formulario de registro</h2>

            <form onSubmit={handleSubmit} className="mx-auto max-w-lg p-3 flex flex-col border border-blue-300 rounded-sm">
                <div className="flex max-sm:flex-col">
                    <label className="mr-2" htmlFor="register-username">Nombre de usuario</label>
                    <input required className="text-black px-1 border border-black rounded-sm" type="text" id="register-username" name="register-username" placeholder="Username" />
                </div>

                <div className="my-5 flex max-sm:flex-col">
                    <label className="mr-2" htmlFor="register-password">Contraseña</label>
                    <input required className="text-black px-1 border border-black rounded-sm" type="password" id="register-password" name="register-password" placeholder="****" />
                </div>

                <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" type="submit">Registrarse</button>
            </form>

            <p className="my-5 text-center">Si ya tienes una cuenta, por favor <Link className="text-blue-300" to="/login">loguéate</Link></p>

            <p className="text-center text-sm">No te olvides la contraseña! Actualmente no existe una forma de restaurarla</p>
        </section>
    )
}

export default Register
