import winston from 'winston';
import { UserTypeMongo } from './types/users';

declare global {
    interface MyReq {
        infoPeticion: string;
        logger: winston.Logger;
    }

    interface CustomUser {
        idUser: string | jwt.JwtPayload
    }

    namespace Express {
        interface Request extends MyReq, CustomUser {} // El Request de Express también incluye la interfaz MyReq
    }
}
