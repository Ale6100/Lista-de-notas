import { useEffect, useRef, useState } from "react"
import { NoteType, ItemsTypes } from "../../types/note"
import { loadingToast, sendToast, sendToastUpdate, swalSeguro } from "../../utils"
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

        const text = formData.get("form-text")?.toString().trim();

        if (!text) {
            return sendToast("error", "Por favor, escribe una nota o cancela")
        }
        
        const button = e.currentTarget.lastChild

        if (!(button instanceof HTMLButtonElement)) {
            return sendToast("error", "Error interno")
        }

        disabledButton(button, true)

        const idToast = loadingToast("Espere....");

        const id = _id

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
            sendToastUpdate(idToast, "success", "Nueva nota agregada!")
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
                    } else {
                        return nota;
                    }
                });
            });

        } else if (json.status === "error" && res.status !== 500) {
            sendToastUpdate(idToast, "error", json.error)
            disabledButton(button, false)
        
        } else {
            console.error("Error interno")
        }
    }
    
    const AddItemForm = () => {
        return (
            <>
            <textarea required name="form-text" className="textareaAddItemForm shadow w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Escribe una nota"></textarea>

            <button type="submit" className='w-full py-2 px-4 text-black font-semibold bg-green-500 hover:bg-green-700 active:bg-green-600'>Agregar</button>
            </>
        )
    }

    const deleteCategory = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget

        const respuesta = await swalSeguro()
        if (!respuesta) return        

        disabledButton(button, true)
        
        const idToast = loadingToast("Espere....");

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes/category/${_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
            }
        })

        const json = await res.json()

        if (json.status === "success") {
            sendToastUpdate(idToast, "success", json.message)
            setNotas(notas => notas.filter(nota => nota._id !== _id));
        
        } else if (json.status === "error" && res.status !== 500) {
            sendToastUpdate(idToast, "error", json.error)    
        
        } else {
            console.error("Error interno")
        }

        disabledButton(button, false)
    }

    const deleteItem = async (e: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
        
        const button = e.currentTarget

        const respuesta = await swalSeguro()
        if (!respuesta) return

        disabledButton(button, true)

        const idToast = loadingToast("Espere....");

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes/category/item/${_id}?itemId=${itemId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
            }
        })

        const json = await res.json()

        if (json.status === "success") {
            sendToastUpdate(idToast, "success", json.message)

            setNotas(notas => {
                return notas.map(nota => {
                    if (nota._id === _id) {
                        const updatedItems = nota.items.filter(item => item.itemId !== itemId);

                        return {
                            ...nota,
                            items: updatedItems
                        };
                    } else {
                        return nota;
                    }
                });
            });            

        } else if (json.status === "error" && res.status !== 500) {
            sendToastUpdate(idToast, "error", json.error)
            
        } else {
            console.error("Error interno")
        }

        disabledButton(button, false)
    }

    return (
        <div className="flex flex-col border border-blue-300 p-1 rounded min-w-[200px] max-w-[256px] h-min bg-blue-800">
            <div className="px-1 mb-1 border-b-2 border-black border-dashed flex justify-between items-center">
                <h3 className="font-semibold text-base w-full">{title}</h3>
                <button onClick={deleteCategory} className="w-10"><img className="w-full" src="./img/delete.svg" alt="Icon trash" /></button>
            </div>

            {
                items.map(item => (
                    <div key={item.itemId} className="mb-2 p-1 flex justify-between items-center bg-slate-800 text-white">
                        <p className="mr-1 w-full text-sm">{item.text}</p>
                        <button onClick={e => deleteItem(e, item.itemId)} className="w-8"><img className="w-full" src="./img/delete2.svg" alt="Icon trash" /></button>
                    </div>
                ))
            }

            <form ref={noteRef} onSubmit={addItem} className={`divAddCategory ${items.length !== 0 && "border-t border-black"}`}>
                {
                    formOpen && <AddItemForm />
                }
            </form>

            <button onClick={() => setFormOpen(!formOpen)} className={`w-full mx-auto h-7 px-4 items-center text-black font-semibold ${formOpen ? "bg-red-500 hover:bg-red-700 active:bg-red-600" : "bg-green-500 hover:bg-green-700 active:bg-green-600"}`}>{formOpen ? "Cancelar" : "Agregar nota"}</button>
        </div>
    )
}

export default Nota