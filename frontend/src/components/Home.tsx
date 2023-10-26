import { useContext, useState, useEffect } from 'react';
import { PersonalContext } from './PersonalContext';
import MessageAutenticate from './MessageAutenticate';
import { NoteType } from '../types/note';
import Note from './notes/Note';
import AddCategory from './notes/AddCategory';
import DisabledButton from './session/LogoutButton';
import OrderNotes from './notes/OrderNotes';
import { ordenarCategorias } from '../utils';

const Home = () => {
    const personalContext = useContext(PersonalContext);
    if (!personalContext) return null
    
    const { user, setUser } = personalContext;

    const [ notas, setNotas ] = useState<NoteType[]>([])
    
    useEffect(() => {
        const traerNotas = async () => {            
            if (!user) return null;

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notes/category/${user?._id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
                }
            }).then(res => res.json())            

            if (res.status === "success") {

                const updated_notes = res.payload

                ordenarCategorias(updated_notes, user.orderCategories)

                setNotas(updated_notes)
                
            } else if (res.status === "error") {
                console.error("Error interno")
            }
        }

        traerNotas()
    }, [user])

    if (!user) return <MessageAutenticate />

    return (
        <div className="px-2">
            <div className='flex justify-between mb-2 items-center'> 
                <p>Bienvenido/a <span className='font-semibold'>{user.username}</span></p>
                <DisabledButton setUser={setUser} />
            </div>

            <AddCategory setNotas={setNotas} user={user} setUser={setUser} />

            {
                notas.length > 0 && <OrderNotes orderCategories={user.orderCategories} setUser={setUser} _id={user._id}/>
            }
            
            <div className='mt-5 flex flex-wrap gap-1 gap-y-5 justify-around'>
            {
                notas.length > 0 ? notas.map(nota => (
                    <Note key={nota._id} {...nota} setNotas={setNotas} setUser={setUser}/>
                )) :

                <p>Todavía no hay notas! agrega las que desees</p>
            }
            </div>

        </div>
    )
}

export default Home
