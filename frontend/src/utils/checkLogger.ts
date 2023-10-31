import { UserInterface } from "../types/user";
import { sendToast } from "./toast";

export const checkLogger = async (getUser: () => Promise<UserInterface | null>, setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>) => {
    const res = await getUser()

    if (res === null) {
        setUser(null)
        sendToast("info", "Su sesión caducó, por favor inicie sesión nuevamente")
        return false
    }

    return true
}
