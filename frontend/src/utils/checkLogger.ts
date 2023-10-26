import { UserInterface } from "../types/user";
import { sendToast } from "./toast";

export const checkLogger = async (getUser: () => Promise<UserInterface | null>, setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>) => {
    let conectado = true

    const res = await getUser()

    if (res === null) {
        conectado = false
    }

    setUser(res)

    if (!conectado) {
        sendToast("info", "Su sesión caducó, por favor inicie sesión nuevamente")
    }

    return conectado
}
