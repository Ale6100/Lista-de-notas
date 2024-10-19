import { useEffect, useRef, useState } from "react"
import { NoteType, ItemsTypes } from "../../types/note"
import { loadingToast, sendToast, sendToastUpdate } from "../../utils/toast"
import { disableButton, enableButton } from "../../utils/disabledButton"
import { checkLogger } from "../../utils/checkLogger"
import getUser from "../../utils/getUser"
import { UserInterface } from "../../types/user"
import Swal from "sweetalert2"
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { ordenarCategorias } from "../../utils"

const AddItemForm = () => {
    return (
        <>
        <textarea required name="form-text" className="textareaAddItemForm shadow  py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Anota algo"></textarea>

        <button type="submit" className=' py-2 px-4 text-black font-semibold bg-green-500 hover:bg-green-700 active:bg-green-600'>Agregar</button>
        </>
    )
}

const Nota = ({ _id, title, fixed, items, setNotas, setUser, orderCategories }: { _id: string, title: string, fixed?: boolean, items: ItemsTypes[], setNotas: React.Dispatch<React.SetStateAction<NoteType[]>>, setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>, orderCategories: UserInterface["orderCategories"] }) => {
    const colorPlateadoNota = "bg-slate-800"

    const [ formOpen, setFormOpen ] = useState(false)

    const categoryRef = useRef<HTMLDivElement>(null)
    const addNoteRef = useRef<HTMLFormElement>(null)

    const [parentItems] = useAutoAnimate();

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

        if (!(button instanceof HTMLButtonElement)) {
            return console.error("Error interno")
        }

        disableButton(button)

        const connected = await checkLogger(getUser, setUser)
        if (!connected) return null;

        const text = formData.get("form-text")?.toString().trim();

        if (!text) {
            return sendToast("error", "Por favor, escribe una nota o cancela")
        }

        const idToast = loadingToast("Espere....");

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
            enableButton(button)

        } else {
            console.error("Error interno")
        }
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

        disableButton(button)

        const connected = await checkLogger(getUser, setUser)
        if (!connected || !respuesta) {
            divCategory?.classList.remove("bg-red-900")
            return null
        }

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

        divCategory?.classList.remove("bg-red-900")

        enableButton(button)
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

        disableButton(button)

        const connected = await checkLogger(getUser, setUser)
        if (!connected || !respuesta) {
            divNote?.classList.replace("bg-red-900", colorPlateadoNota)
            return null
        }

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

            const updateNota = (nota: NoteType, itemId: string) => {
                if (nota._id === _id) {
                    const updatedItems = nota.items.filter(item => item.itemId !== itemId);
                    return {...nota, items: updatedItems };
                }
                return nota;
            };

            setNotas(notas => notas.map(nota => updateNota(nota, itemId)));

        } else if (json.status === "error" && res.status !== 500) {
            sendToastUpdate(idToast, "error", json.error)

        } else {
            console.error("Error interno")
        }

        divNote?.classList.replace("bg-red-900", colorPlateadoNota)
        enableButton(button)
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

        disableButton(button)

        const connected = await checkLogger(getUser, setUser)
        if (!connected) {
            divCategory?.classList.remove("bg-red-900")
            return null
        }

        const idToast = loadingToast("Espere....");

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
        enableButton(button)
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

        disableButton(button)

        const connected = await checkLogger(getUser, setUser)
        if (!connected) {
            return divNote?.classList.replace("bg-red-900", colorPlateadoNota)
        }

        const idToast = loadingToast("Espere....");

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

            const updateItem = (item: ItemsTypes, itemId: string, newValue: string) => {
                return item.itemId === itemId? {...item, text: newValue } : item;
              };

            const updateNota = (nota: NoteType, _id: string, itemId: string, newValue: string) => {
                return nota._id === _id? {...nota, items: nota.items.map(item => updateItem(item, itemId, newValue)) } : nota;
            };

            setNotas(notas => notas.map(nota => updateNota(nota, _id, itemId, value)));

        } else if (json.status === "error" && res.status !== 500) {
            sendToastUpdate(idToast, "error", json.error)

        } else {
            console.error("Error interno")
        }

        divNote?.classList.replace("bg-red-900", colorPlateadoNota)
        enableButton(button)
    }

    const fixCategory = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget

        const newFixed = !fixed

        disableButton(button)

        const connected = await checkLogger(getUser, setUser)
        if (!connected) return null

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes/category/fixed/${_id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
            },
            body: JSON.stringify({ fixed: newFixed })
        })

        const json = await res.json()

        if (json.status === "success") {
            setNotas(notas => {
                const newArray = notas.map(nota => {
                    if (nota._id === _id) {
                        return {
                            ...nota,
                            fixed: newFixed
                        };
                    } else {
                        return nota;
                    }
                });

                return ordenarCategorias(newArray, orderCategories)
            });

        } else if (json.status === "error" && res.status !== 500) {
            sendToast("error", "No se pudo fijar la categoría")

        } else {
            console.error("Error interno")
        }

        enableButton(button)
    }

    return (
        <div ref={categoryRef} className={`flex flex-col border-2 ${fixed ? "border-red-500" : "border-blue-300"} p-1 rounded min-w-36 max-w-72 h-min bg-blue-800`}>
            <div className="p-1 mb-1 border-b-2 border-black border-dashed flex items-center">
                <h3 className="font-semibold text-base break-all flex-1">{title}</h3>
                <button title="Marcar como prioritaria" onClick={fixCategory} className="w-5 h-5">
                    <img loading="lazy" className="w-full" src="./img/fixText.svg" alt="Icon Fix" />
                </button>
                <button title="Cambiar título" onClick={changeTitle} className="mx-2 w-5 h-5">
                    <img loading="lazy" className="w-full" src="./img/editText.svg" alt="Icon Edit Text" />
                </button>
                <button title="Eliminar categoría" onClick={deleteCategory}>
                    <img loading="lazy" className="w-5 h-5" src="./img/delete.svg" alt="Icon trash" />
                </button>
            </div>

            <div ref={parentItems}>
            {
                items.map(item => (
                    <div key={item.itemId} className={"mb-2 p-1 flex justify-between items-center text-white " + colorPlateadoNota}>
                        <p className="py-1 mr-1 flex-1 text-sm break-all">{item.text}</p>
                        <button title="Editar nota" onClick={e => editItem(e, item.text, item.itemId)} className="w-5 h-5"><img loading="lazy" className="w-full" src="./img/editText.svg" alt="Icon Edit Text" /></button>
                        <button title="Eliminar nota" onClick={e => deleteItem(e, item.itemId)} className="w-5 h-5"><img loading="lazy" className="w-full" src="./img/delete2.svg" alt="Icon trash" /></button>
                    </div>
                ))
            }
            </div>

            <form ref={addNoteRef} onSubmit={addItem} className={`divAddCategory flex flex-col ${items.length !== 0 && "border-t border-black"}`}>
                {
                    formOpen && <AddItemForm />
                }
            </form>

            <button onClick={() => setFormOpen(!formOpen)} className={`w-full mx-auto h-7 px-4 items-center text-black font-semibold ${formOpen ? "bg-red-500 hover:bg-red-700 active:bg-red-600" : "bg-green-500 hover:bg-green-700 active:bg-green-600"}`}>{formOpen ? "Cancelar" : "Agregar nota"}</button>
        </div>
    )
}

export default Nota
