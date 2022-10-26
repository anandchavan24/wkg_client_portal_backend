const winston = require('winston');
const env = "dev";
var path = require('path');


const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        enumerateErrorFormat(),
        env === 'dev' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`)
    ),
    transports: [
        new winston.transports.File({
            level: "error",
            filename: path.join("/home/josh/Desktop/JOSH/file-error.log"),
            json: true,
            format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        })
    ],
});

module.exports = logger;
