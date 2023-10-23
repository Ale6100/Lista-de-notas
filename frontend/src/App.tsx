// import { useState, useEffect } from "react"
import Home from "./components/Home"
import NavBar from "./components/NavBar"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { sendToast } from "./utils";
import Loggin from "./components/session/Loggin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Creditos from "./components/Creditos";
import CheckLogger from "./components/session/CheckLogger";
import PersonalContextProvider from "./components/PersonalContext";
import Register from "./components/session/Register";

function App() {
    // const [logged, setLogged] = useState(false)

    // useEffect(() => {
    //     const checkLogged = async () => {
    //         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/current`, {
    //             method: "GET",
    //             headers: {
    //                 Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
    //             }
    //         })
    //         const json = await res.json()
    
    //         if (json.status === "success") {
    //             setLogged(json.payload ? true : false)
            
    //         } else {            
    //             sendToast("error", "Error, por favor inténtelo de nuevo más tarde")
    //             setLogged(false)
    //         }            
    //     }
    //     console.log("useEffect de App.tsx");
        
    //     checkLogged()
    // }, [])

    // if (!logged) {
    //     return (
    //         <>
    //         <div className='h-screen w-screen bg-slate-500'>
    //             <Loggin/>
    //         </div>
    //         </>
    //     )
    // }

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
