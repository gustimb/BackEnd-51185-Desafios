import winston from "winston";
import __dirname from "../utils.js";
import path from "path";
import { options } from "../config/options.js";

const currentEnv = options.nodeEnv.env;
console.log(currentEnv);

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

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customLevels.colors
                }),
                winston.format.simple()
            )
        })
    ]
});

const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customLevels.colors
                }),
                winston.format.simple()
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
    req.logger.http(`${req.url} - method: ${req.method}`);
    next();
};
