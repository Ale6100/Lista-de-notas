import { useContext, useState, useEffect } from 'react';
import { PersonalContext } from './PersonalContext';
import MessageAutenticate from './MessageAutenticate';
import { NoteType } from '../types/note';
import Note from './notes/Note';
import AddCategory from './notes/AddCategory';
import LogoutButton from './session/LogoutButton';
import OrderNotes from './notes/OrderNotes';
import { ordenarCategorias } from '../utils';
import Swal from 'sweetalert2';
import { loadingToast, sendToast, sendToastUpdate } from '../utils/toast';
import { disableButton, enableButton } from '../utils/disabledButton';
import { checkLogger } from '../utils/checkLogger';
import getUser from '../utils/getUser';
import Loader from './Loader';
import { useAutoAnimate } from '@formkit/auto-animate/react'

const Home = () => {
    const { user, setUser } = useContext(PersonalContext);

    const [parentCategories] = useAutoAnimate();

    const [ loadingNotes, setLoadingNotes ] = useState(true);
    const [ notas, setNotas ] = useState<NoteType[]>([]);

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

                const newOrder = ordenarCategorias(updated_notes, user.orderCategories)

                setNotas(newOrder)
                setLoadingNotes(false)

            } else if (res.status === "error") {
                console.error("Error interno")
            }
        }

        traerNotas()
    }, [user])

    const handleDeleteAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonDelete = e.currentTarget

        const alert = await Swal.fire({
            title: '¿Desea eliminar permanentemente su usuario?',
            icon: 'warning',
            input: 'password',
            inputLabel: 'Ingrese su contraseña',
            inputPlaceholder: '****',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
            inputValidator: (value) => {
                if (!value) return 'Debe rellenar todos los campos'
            }
        })

        if (!alert.isConfirmed) return null

        disableButton(buttonDelete)

        const connected = await checkLogger(getUser, setUser)
        if (!connected) return null

        const password = alert.value

        if (!password) {
            return sendToast("error", "Debe rellenar todos los campos")
        }

        const idToast = loadingToast("Eliminando usuario...");

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/deleteUser/${user?._id}?username=${user?.username}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password })
        })

        const json = await res.json()

        if (json.status === "success") {
            sendToastUpdate(idToast, "success", json.message)
            setUser(null)

        } else if (json.status === "error" && res.status !== 500) {
            sendToastUpdate(idToast, "error", json.error)

        } else {
            console.error("Error interno")
        }
        enableButton(buttonDelete)
    }

    if (!user) return <MessageAutenticate />

    const renderContent = () => {
        if (loadingNotes) {
            return <Loader />;
        } else if (notas.length > 0) {
            return notas.map(nota => (
                <Note key={nota._id} {...nota} setNotas={setNotas} setUser={setUser} orderCategories={user.orderCategories} />
            ));
        } else {
            return <p>Todavía no hay notas! agrega las que desees</p>;
        }
    };

    return (
        <div className="px-2">
            <div className='flex justify-between mb-2 items-center max-sm:flex-col gap-1'>
                <p className='self-start'>Bienvenido/a <span className='font-semibold'>{user.username}</span></p>
                <div className='self-end'>
                    <LogoutButton setUser={setUser} />
                    <button onClick={handleDeleteAccount} className='ml-2 bg-red-500 hover:bg-red-700 text-slate-900 font-bold py-2 px-4 rounded'>Eliminar cuenta</button>
                </div>
            </div>

            <AddCategory setNotas={setNotas} user={user} setUser={setUser} />

            {
                notas.length > 0 && <OrderNotes orderCategories={user.orderCategories} setUser={setUser} _id={user._id}/>
            }

            <div ref={parentCategories} className='mt-5 flex flex-wrap gap-1 gap-y-5 justify-around'>
            {
                renderContent()
            }
            </div>

        </div>
    )
}

export default Home
