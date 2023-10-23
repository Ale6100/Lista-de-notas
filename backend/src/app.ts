import express from "express";
import __dirname, { waitFor } from "./utils.js";
import cors from "cors";
import corsOptions from "./middlewares/cors.js";
import addLogger from "./middlewares/addLogger.js";
import validateToken from "./middlewares/validateToken.js";
import checkLogger from "./middlewares/checkLogger.js";
import config from "./config/config.js";
import logger from "./utils/logger.js";
import baseRouter from "./routes/base.routes.js";
import sessionRouter from "./routes/sessions.routes.js";
import notesRouter from "./routes/notes.routes.js";
import http from "http";
import connect from "./daos/connect.js";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env["PORT"] ?? 8080; // Elige el puerto 8080 en caso de que no venga definido uno por defecto como variable de entorno

const server: http.Server = app.listen(PORT, async () => { // Escuchamos en el puerto cada vez que se reconozca un nuevo proceso worker. Todos los procesos se comparten el mismo puerto
    const address = server.address();

    if (typeof address === "object" && address !== null) {
        logger.info(`Servidor escuchando en el puerto ${address.port}`);
        await connect();
    }
}); 
server.on("error", error => logger.fatal(`${error}`))

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended: true })); // Habilita poder procesar y parsear datos más complejos en la url
app.use(cookieParser());

const whitelist = [] // Habilito los frontend que no vengan como string vacío
if (config.site.urlfrontend1) whitelist.push(config.site.urlfrontend1)
if (config.site.urlfrontend2) whitelist.push(config.site.urlfrontend2)
if (config.site.urlfrontend3) whitelist.push(config.site.urlfrontend3)

if (whitelist.length === 0) {
    logger.fatal("Debes colocar al menos una url frontend en las variables de entorno! Visita https://github.com/Ale6100/Curso-backend#despliegue-")
    await waitFor(200)
    throw new Error(`Debes colocar al menos una url frontend en las variables de entorno! Visita https://github.com/Ale6100/Curso-backend#despliegue-`) 
}

app.use(cors(corsOptions(whitelist)))

app.use(addLogger)
app.use(validateToken)
app.use(checkLogger)

app.use("/", baseRouter)
app.use("/api/sessions", sessionRouter)
app.use("/api/notes", notesRouter)
