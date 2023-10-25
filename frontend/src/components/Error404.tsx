import { useEffect } from 'react';

const Error404 = () => {
    useEffect(() => {
        document.title = "Error 404 | Lista de Notas";

        return () => {
            document.title = "Lista de Notas";
        }
    }, []);

    return (
        <div className='error404'>
            <h2 className='mt-8 text-center font-semibold text-xl'>Error 404 | Página no encontrada</h2>
        </div>
    );
}

export default Error404;
