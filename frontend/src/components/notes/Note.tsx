import { useEffect, useRef, useState } from "react"
import { NoteType, ItemsTypes } from "../../types/note"
import { loadingToast, sendToast, sendToastUpdate } from "../../utils/toast"
import disabledButton from "../../utils/disabledButton"
import { checkLogger } from "../../utils/checkLogger"
import getUser from "../../utils/getUser"
import { UserInterface } from "../../types/user"
import Swal from "sweetalert2"

const Nota = ({ _id, title, items, setNotas, setUser }: { _id: string, title: string, items: ItemsTypes[], setNotas: React.Dispatch<React.SetStateAction<NoteType[]>>, setUser: React.Dispatch<React.SetStateAction<UserInterface | null>> }) => {
    const colorPlateadoNota = "bg-slate-800"

    const [ formOpen, setFormOpen ] = useState(false)

    const categoryRef = useRef<HTMLDivElement>(null)
    const addNoteRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        const divNote = addNoteRef.current

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
        const button = e.currentTarget.lastChild

        const connected = await checkLogger(getUser, setUser)
        if (!connected) return null;

        const text = formData.get("form-text")?.toString().trim();

        if (!text) {
            return sendToast("error", "Por favor, escribe una nota o cancela")
        }

        if (!(button instanceof HTMLButtonElement)) {
            return console.error("Error interno")
        }

        const idToast = loadingToast("Espere....");

        disabledButton(button, true)

        const id = _id

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes/category/item/${id}`, {
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

        const divCategory = categoryRef.current
        divCategory?.classList.add("bg-red-900")

        const respuesta = await Swal.fire({
            title: '¿Estás seguro de eliminar la cateoría?',
            text: "No podrás revertirlo!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, eliminar!',
            confirmButtonColor: '#3085d6',
        }).then((result) => result.isConfirmed)

        const connected = await checkLogger(getUser, setUser)
        if (!connected || !respuesta) {
            divCategory?.classList.remove("bg-red-900")
            return null
        }

        const idToast = loadingToast("Espere....");

        disabledButton(button, true)

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

        divCategory?.classList.remove("bg-red-900")

        disabledButton(button, false)
    }

    const deleteItem = async (e: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
        const button = e.currentTarget

        const divNote = button.parentElement
        divNote?.classList.replace(colorPlateadoNota, "bg-red-900")

        const respuesta = await Swal.fire({
            title: '¿Estás seguro de eliminar la nota?',
            text: "No podrás revertirlo!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, eliminar!',
            confirmButtonColor: '#3085d6',
        }).then((result) => result.isConfirmed)

        const connected = await checkLogger(getUser, setUser)
        if (!connected || !respuesta) {
            divNote?.classList.replace("bg-red-900", colorPlateadoNota)
            return null
        }

        const idToast = loadingToast("Espere....");

        disabledButton(button, true)

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

        divNote?.classList.replace("bg-red-900", colorPlateadoNota)
        disabledButton(button, false)
    }

    const changeTitle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const divCategory = categoryRef.current
        divCategory?.classList.add("bg-red-900")

        const button = e.currentTarget

        const { value } = await Swal.fire({
            title: 'Cambiar título',
            input: "text",
            text: `Por favor, proporcione un nuevo titulo`,
            inputValue: title,
            inputValidator: (value) => {
                if (!value) return "Coloque un valor válido!"
            },
            icon: 'info',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Cambiar',
            confirmButtonColor: '#3085d6',
        })

        if (!value || value === title) {
            return divCategory?.classList.remove("bg-red-900")
        }

        const idToast = loadingToast("Espere....");

        disabledButton(button, true)

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes/category/${_id}`, {
            method: "PATCH",
            body: JSON.stringify({
                title: value
            }),
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        })

        const json = await res.json()

        if (json.status === "success") {
            sendToastUpdate(idToast, "success", json.message)
            setNotas(notas =>notas.map(nota => {
                if (nota._id === _id) {
                    return {
                        ...nota,
                        title: value
                    }
                } else {
                    return nota
                }
            }))
        } else if (json.status === "error" && res.status !== 500) {
            sendToastUpdate(idToast, "error", json.error)

        } else {
            console.error("Error interno")
        }

        divCategory?.classList.remove("bg-red-900")
        disabledButton(button, false)
    }

    const editItem = async (e: React.MouseEvent<HTMLButtonElement>, text: string, itemId: string) => {
        const button = e.currentTarget

        const divNote = button.parentElement
        divNote?.classList.replace(colorPlateadoNota, "bg-red-900")

        const { value } = await Swal.fire({
            title: 'Editar nota',
            input: "text",
            inputValue: text,
            text: `Por favor, modifique la nota a su gusto`,
            inputValidator: (value) => {
                if (!value) return "Coloque un valor válido!"
            },
            icon: 'info',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Cambiar',
            confirmButtonColor: '#3085d6',
        })

        if (!value || value === text) {
            return divNote?.classList.replace("bg-red-900", colorPlateadoNota)
        }

        const idToast = loadingToast("Espere....");

        disabledButton(button, true)

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes/category/item/${_id}?itemId=${itemId}`, {
            method: "PATCH",
            body: JSON.stringify({
                text: value
            }),
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        })

        const json = await res.json()

        if (json.status === "success") {
            sendToastUpdate(idToast, "success", json.message)
            setNotas(notas =>notas.map(nota => {
                if (nota._id === _id) {
                    return {
                        ...nota,
                        items: nota.items.map(item => {
                            if (item.itemId === itemId) {
                                return {
                                    ...item,
                                    text: value
                                }
                            } else {
                                return item
                            }
                        })
                    }
                } else {
                    return nota
                }
            }))

        } else if (json.status === "error" && res.status !== 500) {
            sendToastUpdate(idToast, "error", json.error)

        } else {
            console.error("Error interno")
        }

        divNote?.classList.replace("bg-red-900", colorPlateadoNota)
        disabledButton(button, false)
    }

    return (
        <div ref={categoryRef} className="flex flex-col border border-blue-300 p-1 rounded min-w-[200px] max-w-[256px] h-min bg-blue-800">
            <div className="p-1 mb-1 border-b-2 border-black border-dashed flex justify-between items-center">
                <h3 className="font-semibold text-base w-full">{title}</h3>
                <div className="w-20 flex">
                    <button onClick={changeTitle} className="mr-1"><img className="w-full" src="./img/editText.svg" alt="Icon Edit Text" /></button>
                    <button onClick={deleteCategory}><img className="w-full" src="./img/delete.svg" alt="Icon trash" /></button>
                </div>
            </div>

            {
                items.map(item => (
                    <div key={item.itemId} className={"mb-2 p-1 flex justify-between items-center text-white " + colorPlateadoNota}>
                        <p className="mr-1 w-full text-sm">{item.text}</p>
                        <button onClick={e => editItem(e, item.text, item.itemId)} className="w-8"><img className="w-full" src="./img/editText.svg" alt="Icon Edit Text" /></button>
                        <button onClick={e => deleteItem(e, item.itemId)} className="w-8"><img className="w-full" src="./img/delete2.svg" alt="Icon trash" /></button>
                    </div>
                ))
            }

            <form ref={addNoteRef} onSubmit={addItem} className={`divAddCategory ${items.length !== 0 && "border-t border-black"}`}>
                {
                    formOpen && <AddItemForm />
                }
            </form>

            <button onClick={() => setFormOpen(!formOpen)} className={`w-full mx-auto h-7 px-4 items-center text-black font-semibold ${formOpen ? "bg-red-500 hover:bg-red-700 active:bg-red-600" : "bg-green-500 hover:bg-green-700 active:bg-green-600"}`}>{formOpen ? "Cancelar" : "Agregar nota"}</button>
        </div>
    )
}

export default Nota