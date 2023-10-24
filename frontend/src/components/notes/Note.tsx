import { useEffect, useRef, useState } from "react"
import { NoteType, ItemsTypes } from "../../types/note"
import { sendToast } from "../../utils"
import disabledButton from "../../utils/disabledButton"

const Nota = ({ _id, title, items, setNotas }: { _id: string, title: string, items: ItemsTypes[], setNotas: React.Dispatch<React.SetStateAction<NoteType[]>> }) => {
    const [ formOpen, setFormOpen ] = useState(false)

    const noteRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        const divNote = noteRef.current

        if (divNote) {
            if (formOpen) {
                divNote.classList.remove("hidden")
                
            } else {
                divNote.classList.add("hidden")
            }
        }
    }, [formOpen])

    const addItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const text = formData.get("form-text");

        if (!text || typeof text !== "string") {
            return sendToast("error", "Por favor, escribe una nota o cancela")
        }
        
        const button = e.currentTarget.lastChild

        if (!(button instanceof HTMLButtonElement)) {
            return sendToast("error", "Error interno")
        }

        disabledButton(button, true)

        sendToast("info", "Espere...", 2000)

        const id = e.currentTarget.id        

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        })

        const json = await res.json()

        if (json.status === "success") {
            sendToast("success", "Nueva nota agregada!")
            setFormOpen(false)
            setNotas(notas => {
                return notas.map(nota => {
                    if (nota._id === id) {
                        const updatedItems = [...nota.items, {
                            itemId: json.payload,
                            text
                        }];

                        return {
                            ...nota,
                            items: updatedItems
                        };
                    } else { // No debería suceder nunca esto, pero por si acaso
                        return nota;
                    }
                });
            });

        } else if (json.status === "error" && res.status !== 500) {
            sendToast("error", json.error)
            disabledButton(button, false)
        
        } else {
            console.error("Error interno")
        }
    }
    
    const AddItemForm = () => {
        return (
            <>
            <textarea name="form-text" className="textareaAddItemForm shadow w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Escribe una nota"></textarea>

            <button type="submit" className='w-full py-2 px-4 text-white font-semibold bg-green-500 hover:bg-green-700 active:bg-green-600'>Agregar</button>
            </>
        )
    }

    return (
        <div className="flex flex-col border border-black w-44 h-min">
            <h3 className="font-semibold text-center mb-1 border-b-2 border-black border-dashed text-lg">{title}</h3>

            {
                items.map(item => (
                    <p className="px-1" key={item.itemId}>• {item.text}</p>
                ))
            }

            <form ref={noteRef} onSubmit={addItem} id={_id} className={`divAddCategory ${items.length !== 0 && "border-t border-black"}`}>
                {
                    formOpen && <AddItemForm />
                }
            </form>

            <button onClick={() => setFormOpen(!formOpen)} className={`w-full mx-auto h-7 px-4 items-center text-white font-semibold ${formOpen ? "bg-red-500 hover:bg-red-700 active:bg-red-600" : "bg-green-500 hover:bg-green-700 active:bg-green-600"}`}>{formOpen ? "Cancelar" : "Agregar nota"}</button>
        </div>
    )
}

export default Nota