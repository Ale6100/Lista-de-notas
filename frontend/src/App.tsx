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
import Error404 from "./components/Error404";

function App() {
    return (
        <PersonalContextProvider>
            <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                    <NavBar/>
                    <CheckLogger/>

                    <main className="p-2 bg-slate-900 text-white flex-1">
                        <Routes>
                            <Route path='/' element={<Home/>}/>
                            <Route path='/login' element={<Loggin/>}/>
                            <Route path='/register' element={<Register/>}/>
                            <Route path="*" element={<Error404 />} />
                        </Routes>
                    </main>
                </div>
                <Creditos/>
            </BrowserRouter>
            <ToastContainer />
        </PersonalContextProvider>
    )
}

export default App
