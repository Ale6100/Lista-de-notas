import { useContext, useState, useEffect } from 'react';
import { PersonalContext } from './PersonalContext';
import MessageAutenticate from './MessageAutenticate';
import { NoteType } from '../types/note';
import Nota from './notes/Note';
import AddCategory from './notes/AddCategory';
import DisabledButton from './session/DisabledButton';

const Home = () => {
    const personalContext = useContext(PersonalContext);
    if (!personalContext) return null
    
    const { user, setUser } = personalContext;

    const [ notas, setNotas ] = useState<NoteType[]>([])
    
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

    if (!user) return <MessageAutenticate />

    return (
        <div className="px-2">
            <div className='flex justify-between my-2 items-center'> 
                <p>Bienvenido <span className='font-semibold'>{user.username}</span></p>
                <DisabledButton setUser={setUser} />
            </div>

            <AddCategory setNotas={setNotas}/>
            
            <div className='mt-5 flex flex-wrap gap-2 justify-around'>
            {
                notas.length > 0 ? notas.map(nota => (
                    <Nota key={nota._id} {...nota} setNotas={setNotas}/>
                )) :

                <p>Todavía no hay notas! agrega las que desees</p>
            }
            </div>

        </div>
    )
}

export default Home