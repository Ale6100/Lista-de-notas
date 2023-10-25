const getUser = async () => {    
    const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/current`, {
        method: "GET",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
        },
    }).then(res => res.json())

    return result.payload
}

export default getUser
