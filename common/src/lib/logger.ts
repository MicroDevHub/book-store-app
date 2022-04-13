import winston from 'winston'
import { levels, colors } from '../types/const';
import { TransformableInfo } from 'logform';

interface Config {
    labelService?: string;
    timestampFormat: string;
    templateFunction?: (info: TransformableInfo) => string;
}

class Logger {

    public logger: any;
    public config: Config | any;

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

    public format() {
        const templateFunction = this.config?.templateFunction || this.template;
        const combineFormat = winston.format.combine(
            winston.format.label({ label: this.config?.labelService, message: !!this.config?.labelService }),
            winston.format.timestamp({ format: this.config?.timestampFormat || 'YYYY-MM-DD HH:mm:ss:ms' }),
            winston.format.colorize({ all: true }),
            winston.format.printf(
                templateFunction,
            )
        );

        return combineFormat;
    }

    template(info: TransformableInfo) {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    }

    private transports() {
        const transports = [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
            }),
            new winston.transports.File({ filename: 'logs/all.log' }),
        ];
        return transports;
    }

    private level() {
        return process.env.LOG_LEVEL || 'info' ;
    }
}

export default Logger;
