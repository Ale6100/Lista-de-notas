import { UserInterface } from "../../types/user";
import { loadingToast, sendToast, sendToastUpdate } from "../../utils/toast";
import disabledButton from "../../utils/disabledButton";
import { checkLogger } from "../../utils/checkLogger";
import getUser from "../../utils/getUser";

const OrderNotes = ({ orderCategories, setUser, _id }: { orderCategories: UserInterface["orderCategories"], setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>, _id: string }) => {

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget);
        const button = e.currentTarget.lastChild

        const connected = await checkLogger(getUser, setUser)
        if (!connected) return null;

        const orderCategories = formData.get("select")?.toString().trim() as UserInterface["orderCategories"];

        if (!orderCategories) {
            console.error("Error inteno");
            return sendToast("error", "Error, selecciona una opción")
        }

        if (!(button instanceof HTMLButtonElement)) {
            return console.error("Error interno")
        }

        const idToast = loadingToast("Espere....");

        disabledButton(button, true)

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/changeOrderCategories/${_id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ orderCategories })
        })

        const json = await res.json()

        if (json.status === "success") {
            setUser(user => {
                if (!user) {
                    return null
                } else {
                    return {
                        ...user,
                        orderCategories
                    }
                }
            })
            sendToastUpdate(idToast, "success", json.message)
        
        } else if (json.status === "error" && res.status !== 500) {
            sendToastUpdate(idToast, "error", json.error)
        
        } else {
            console.error("Error interno")
        }
        disabledButton(button, false)
    }

    return (
        <form onSubmit={handleSubmit} className="flex my-5">
            <label className="mr-2 rounded" htmlFor="OrderNotes-select">Ordenar por</label>
            
            <select className="text-black" name="select" defaultValue={orderCategories} id="OrderNotes-select">
                <option value="alphabetic">Alfabético</option>
                <option value="reverse alphabetic">Alfabético inverso</option>
                <option value="more items">Más elementos</option>
                <option value="less items">Menos elementos</option>
                <option value="date">Fecha ↓</option>
                <option value="reverse date">Fecha ↑</option>
            </select>

            <button className="px-1 ml-2 rounded bg-green-500 hover:bg-green-700 active:bg-green-600" type="submit">OK</button>
        </form>
    )
}

export default OrderNotes;
