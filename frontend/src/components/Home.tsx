import { useContext, useState, useEffect } from 'react';
import { PersonalContext } from './PersonalContext';
import MessageAutenticate from './MessageAutenticate';
import { NoteInterface } from '../types/note';
import Nota from './notes/Note';
import disabledButton from '../utils/disabledButton';
import { sendToast } from '../utils';
import AddNote from './notes/AddNote';

const Home = () => {
    const personalContext = useContext(PersonalContext);
    if (!personalContext) return null
    
    const { user, setUser } = personalContext;

    const [ notas, setNotas ] = useState<NoteInterface[]>([])
    
    useEffect(() => {
        const traerNotas = async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
                }
            }).then(res => res.json())

            if (res.status === "success") {
                setNotas(res.payload)
                console.log(res.payload);
                
            } else if (res.status === "error") {
                console.error("Error interno")
            }
        }

        traerNotas()
    }, [])

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonLogout = e.currentTarget
        disabledButton(buttonLogout, true)

        sendToast("info", "Cerrando sesión...", 2000)

        const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/logout`, {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
            }
        }).then(res => res.json())
    
        if (result.status === "success") {
            setUser(null)
            sendToast("success", "Sesión cerrada!")
        
        } else {
            console.error("Error! Intente de nuevo más tarde")
        }
        disabledButton(buttonLogout, false)
    }    

    if (!user) return <MessageAutenticate />

    return (
        <div className="px-2">
            <div className='flex justify-between my-2 items-center'> 
                <p>Bienvenido <span className='font-semibold'>{user.username}</span></p>
                <button onClick={handleLogout} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Cerrar sesión</button>
            </div>

            <AddNote/>
            
            {
                notas.length > 0 ? notas.map(nota => (
                    <Nota key={nota.id} {...nota}/>
                )) :

                <p>Todavía no hay notas! agrega las que desees</p>
            }
        </div>
    )
}

export default Home
