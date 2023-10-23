import config from "../config/config.js"
import mongoose from 'mongoose';
import logger from "../utils/logger.js";
import { waitFor } from "../utils.js";

export default async () => {
    try {
        await mongoose.connect(config.mongo.url);
        logger.info(`Base de mongo conectada`);        
    } catch (error) {
        logger.fatal(`${error}`);
        await waitFor(200)
        throw new Error(`${error}`)
    }
}
