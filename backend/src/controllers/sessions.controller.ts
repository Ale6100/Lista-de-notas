// import UserDto from "../dao/DTO/User.dto.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
// import { userService, cartService } from "../services/repositories/services.js"
// import sendMail from "../services/mailingService.js";
import { createHash, validatePassword } from "../utils.js";
import { Request, Response } from "express";
// import { Email } from "../types/types.js";
import UserContainer from "../daos/UserContainer.js";

const User = new UserContainer()

const register = async (req: Request, res: Response) => { // En /api/sessions/register con el método POST, registra a un usuario en la base de datos
    try {        
        const { username, password } = req.body;
        if (!username || !password) {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.status(400).send({status: "error", error: "Valores incompletos"}) 
        }
        
        const user = await User.getByUsername(username)
        if (user) {
            req.logger.error(`${req.infoPeticion} | The username already exists in our database`)
            return res.status(400).send({status: "error", error: "El nombre de usuario ya existe en nuestra base de datos"})
        }
        
        const hashedPassword = await createHash(password) // Hashea la contraseña para que no sea visible para nadie

        const usuario = {
            username,
            password: hashedPassword, // Guardamos en MongoDB el pasword hasheado
        }
    
        const result = await User.save(usuario)
        return res.status(200).send({ status: "success", payload: result}) // Enviamos al usuario, dando por hecho que todo salió bien
    
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({status: "error", error })
    }
}

const login = async (req: Request, res: Response) => { // En /api/sessions/login con el método POST, logueamos al usuario según el email y password que llegó en el body
    try {
        const { username, password } = req.body

        if (!username || !password) {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.status(400).send({status: "error", error: "Valores incompletos"}) 
        }

        const usuario = await User.getByUsername(username)
        
        if (!usuario) {
            req.logger.error(`${req.infoPeticion} | User not registered`)
            return res.status(400).send({status: "error", error: "Usuario no registrado"})
        }
        
        const isValidPassword = await validatePassword(usuario, password)

        if (!isValidPassword) {
            req.logger.error(`${req.infoPeticion} | Contraseña inválida`)
            return res.status(400).send({status: "error", error: "Contraseña inválida"})
        }
    
        const tokenizedUser = jwt.sign({ id: usuario._id, username }, config.jwt.secret, { expiresIn: "7d" }) // Colocamos la tokenización | Cifra al usuario en un token que expira en 7 días
        return res.cookie(config.jwt.nameCookie, tokenizedUser, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).status(200).send({ status: "success", message: `Usuario ${username} logueado!`}) // Guardo el token en una cookie con un nombre para identificarlo
    
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({status: "error", error })
    }
}

const current = async (req: Request, res: Response) => { // En /api/sessions/current con el método GET se obtiene la información del usuario logueado
    try {
        const user = req.user ? req.user : null
        return res.status(200).send({ status: "success", payload: user })        
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({status: "error", error })        
    }
}

const logout = async (req: Request, res: Response) => { // En /api/sessions/logout con el método GET se desloguea al usuario actual, si es que había uno logueado
    try {
        res.clearCookie(config.jwt.nameCookie, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).send({ status: "success", message: "Usuario deslogueado" }) // Deslogueo al usuario eliminando la cookie
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        res.status(500).send({ status: "error", error: "Error, inténtelo de nuevo más tarde" })
    }
}

export default {
    register,
    login,
    current,
    logout,
}
