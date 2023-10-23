import dotenv from "dotenv"
import logger from "../utils/logger.js";
import { waitFor } from "../utils.js";

dotenv.config(); // Copia todas las igualdades que estén en el archivo ".env" y las convierte a propiedades del process.env (es decir, inicializa todas las variables de entorno que defina allí)

// Por seguridad al archivo .env no es público, puedes hacerte el tuyo a la altura de la carpeta src

const errorSiNoExiste = async (variable: string) => { // Comprueba la existencia de variables de entorno
    const v = process.env[variable]

    if (v !== undefined) {
        return v
    } else {
        logger.fatal(`Error: La variable de entorno ${variable} no está definida`)
        await waitFor(200) // Es necesario esperar un poco antes de arrojar el error porque sino el logger.fatal no funciona como debería
        throw new Error(`Error: La variable de entorno ${variable} no está definida`);
    }
}

export default { // Se exporta un objeto que incluye de manera ordenada las variables de entorno recién mencionadas   
    site: {
        urlfrontend1: process.env["URL_FRONTEND1"],
        urlfrontend2: process.env["URL_FRONTEND2"], // URLs de los frontends que desees dar permisos de acceso, sin barra lateral final. Debes dejar como string vacío las variables que no desees usar
        urlfrontend3: process.env["URL_FRONTEND3"],
    },

    token: {
        gral: await errorSiNoExiste("TOKEN_GRAL"), // Token arbitrario personal, necesario para acceder a los endpoints
    },

    mongo: {
        url: await errorSiNoExiste("MONGO_URL")
    },

    jwt: {
        secret: await errorSiNoExiste("JWT_SECRET"),
        nameCookie: await errorSiNoExiste("JWT_NAME_COOKIE"),
    }
}
