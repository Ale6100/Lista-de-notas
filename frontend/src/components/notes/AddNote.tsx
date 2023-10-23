import { useState, useRef, useEffect } from "react"
import { sendToast } from "../../utils"
import disabledButton from "../../utils/disabledButton"

const AddNote = () => {
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
    

    const addNote = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const title = formData.get("form-title");

        if (!title) {
            return sendToast("error", "Por favor, escribe un título para la nueva categoría")
        }

        const button = e.currentTarget.lastChild

        if (!(button instanceof HTMLButtonElement)) {
            return sendToast("error", "Error interno")
        }

        disabledButton(button, true)

        sendToast("info", "Espere...", 1500)
    }

    const AddNoteForm = () => {
        return (
            <>
            <label htmlFor="form-title" className="text-center block text-gray-700 text-xl font-bold mb-2">Título</label>
            <input type="text" id="form-title" name="form-title" className="text-center shadow border rounded w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>

            <button type="submit" className='w-44 mx-auto py-2 px-4 items-center text-white font-semibold bg-green-500 hover:bg-green-700 active:bg-green-600 rounded'>Agregar</button>
            </>
        )
    }

    return (
        <div className="flex flex-col">
            <button onClick={() => setFormOpen(!formOpen)} className='w-44 mx-auto py-2 px-4 flex justify-between items-center bg-gray-300 hover:bg-gray-400 active:bg-gray-500 rounded'>
                <p>Agregar nota</p>
                <img className='h-10' src="./img/addNote.svg" alt="Icon add note" />           
            </button>

            <form ref={noteRef} onSubmit={addNote} className="divAddNote visible mt-2 mx-auto px-2 h-40 flex flex-col justify-around border-black border rounded-sm">
                {
                    formOpen && <AddNoteForm />
                }
            </form>            
        </div>
    )
}

export default AddNote
