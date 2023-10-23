import { UserInterface } from "../types/user"

const getUser = async (setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>) => {
    let user = null
    
    const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/current`, {
        method: "GET",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
        },
    }).then(res => res.json())

    user = result.payload    

    setUser(user)
    return user
}

export default getUser
