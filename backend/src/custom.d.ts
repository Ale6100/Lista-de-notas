import winston from 'winston';

declare global {
    interface MyReq {
        infoPeticion: string;
        logger: winston.Logger;
    }

    interface CustomUser {
        user: UserLogin;
    }    

    namespace Express {
        interface Request extends MyReq, CustomUser {} // El Request de Express también incluye la interfaz MyReq
    }
}
