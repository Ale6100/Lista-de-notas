import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <header className="h-14 bg-blue-800 flex justify-center items-center">
            <h1 className="text-white text-3xl font-semibold"> <Link to="/">Lista de Tareas</Link></h1>
        </header>
    )
}

export default NavBar
