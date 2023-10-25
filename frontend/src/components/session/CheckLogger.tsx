import { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PersonalContext } from "../PersonalContext";
import getUser from '../../utils/getUser';
import { loadingToast, sendToastUpdate } from '../../utils';
import { UserInterface } from '../../types/user';

const CheckLogger = () => { // Se encarga de preguntar si el usuario está logueado, cada vez que se cambia la url
    const personalContext = useContext(PersonalContext);
    if (!personalContext) return null
    
    const { setUser } = personalContext;

    const [ conectado, setConectado ] = useState(false);

    const location = useLocation();

    useEffect(() => { // Trae la información de un usuario cada vez que cambio de ruta
        
        let idToast: number | string = 0
        if (!conectado) {
            idToast = loadingToast("Conectando con la base de datos, por favor espere...")
        }

        getUser()
        .then((res: UserInterface | null) => {
            setUser(res)
            
        }).finally(() => {
            if (!conectado) {
                setConectado(true);
                sendToastUpdate(idToast, "success", "Bienvenido", 2000)
            }            
        })

    }, [location]);

    return <></>;
}

export default CheckLogger;
