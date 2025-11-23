import winston, { Logger } from 'winston';
import config from '../config/envConfig.ts';

const winstonLogger: Logger = winston.createLogger({
    level: config.env === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: "Ecommerce" },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({
            filename: "combined.log",
        }),
    ]

})

export default winstonLogger;