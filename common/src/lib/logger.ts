import winston, {format, Logger} from 'winston'
import {colors, levels} from '../types/const';

const { label, colorize, combine, splat, timestamp, printf } = format;

interface Config {
    labelService?: string;
    timestampFormat?: string;
}

interface ILogger extends Logger {}

interface ILoggerFactory {
    (name: string): { logger: ILogger };
}

class LoggerFactory {
    public logger: Logger;
    private config: Config | any;

    constructor(config?: Config) {
        this.config = config;
        winston.addColors(colors);
        const format = this.format();
        const transports = this.transports();

        this.logger = winston.createLogger({
            level: this.level(),
            levels,
            format,
            transports,
        })
    }

    private format() {
        return winston.format.combine(
            label({label: this.config?.labelService, message: !!this.config?.labelService}),
            timestamp({format: this.config?.timestampFormat || 'YYYY-MM-DD HH:mm:ss:ms'}),
            colorize({all: true}),
            printf(({level, message, timestamp, ...metadata}) => {
                let msg = `${timestamp} [${level}] : ${message} `
                const metaMsg = JSON.stringify(metadata);
                if (metaMsg !== "{}") {
                    msg += metaMsg;
                }
                return msg
            }),
            combine(splat())
        );
    }

    private transports() {
        return [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
            }),
            new winston.transports.File({filename: 'logs/all.log'}),
        ];
    }

    private level() {
        return process.env.LOG_LEVEL || 'info' ;
    }
}

export {
    ILogger,
    LoggerFactory,
    ILoggerFactory
}
