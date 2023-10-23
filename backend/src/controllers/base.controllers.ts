import __dirname from "../utils.js";
import { Response, Request } from "express";

const base = (_req: Request, res: Response) => {
    res.send({ status: "success", message: "Bienvenido a mi backend. Este es el único endpoint público" })
}

export default {
    base
}
