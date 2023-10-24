import Home from "./components/Home"
import NavBar from "./components/NavBar"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loggin from "./components/session/Loggin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Creditos from "./components/Creditos";
import CheckLogger from "./components/session/CheckLogger";
import PersonalContextProvider from "./components/PersonalContext";
import Register from "./components/session/Register";

function App() {
    return (
        <>
        <PersonalContextProvider>
            <BrowserRouter>
                <NavBar/>
                <CheckLogger/>

                <main className="px-2">
                    <Routes>
                        <Route path='/' element={<Home/>}/>
                        <Route path='/login' element={<Loggin/>}/>
                        <Route path='/register' element={<Register/>}/>
                    </Routes>
                </main>

                <Creditos/>
            </BrowserRouter>
            <ToastContainer />
        </PersonalContextProvider>
        </>
    )
}

export default App
