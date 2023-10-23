import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { PersonalContext } from "../PersonalContext";
import getUser from '../../utils/getUser';

const CheckLogger = () => { // Se encarga de preguntar si el usuario está logueado, cada vez que se cambia la url
    const personalContext = useContext(PersonalContext);
    if (!personalContext) return null
    
    const { setUser } = personalContext;

    const location = useLocation();

    useEffect(() => { // Trae la información de un usuario cada vez que cambio de ruta
        console.log("useEffect de CheckLogger");
        
        getUser(setUser)
      
    }, [location]);

    return <></>;
}

export default CheckLogger;
