import winston from "winston";
import __dirname from "../utils.js";
import path from "path";
import { options } from "../config/options.js";

const currentEnv = options.nodeEnv.env;

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "magenta",
        error: "red",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "gray",
    }
};

const fecha = new Date().toLocaleDateString();
const hora = new Date().toLocaleTimeString();

export const logger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customLevels.colors
                }),
                winston.format.simple(),
                winston.format.printf(log => `${fecha} ${hora} | ${log.level} | ${log.message}`)
            )
        })
    ]
});


const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customLevels.colors
                }),
                winston.format.simple(),
                winston.format.printf(log => `${fecha} ${hora} | ${log.level} | ${log.message}`)
            )
        })
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customLevels.colors
                }),
                winston.format.simple(),
                winston.format.printf(log => `${fecha} ${hora} | ${log.level} | ${log.message}`)
            )
        }),
        new winston.transports.File({
            filename: path.join(__dirname, "/logs/errors.log"),
            level: "error"
        })
    ]
});

// MIDDLEWARE

export const addLogger = (req, res, next) => {
    if (currentEnv === "development") {
        req.logger = devLogger;
    } else {
        req.logger = prodLogger;
    };
    req.logger.http(`${req.url}`);
    next();
};
