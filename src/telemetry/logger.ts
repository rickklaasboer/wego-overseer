/* eslint-disable @typescript-eslint/ban-types */
import Bunyan, {LoggerOptions} from 'bunyan';

export default class Logger {
    private bunyan: Bunyan;

    constructor(name: string, options?: LoggerOptions) {
        this.bunyan = Bunyan.createLogger({
            name: name,
            level: 0,
            ...options,
        });
    }

    /**
     * Log a fatal error message
     */
    fatal = (err: Error | Object | unknown, ...params: any[]) => {
        params.length ? this.bunyan.fatal(err, params) : this.bunyan.fatal(err);
    };

    /**
     * Log an error message
     */
    error = (err: Error | Object | unknown, ...params: any[]) => {
        params.length ? this.bunyan.error(err, params) : this.bunyan.error(err);
    };

    /**
     * Log a warning message
     */
    warn = (err: Error | Object | unknown, ...params: any[]) => {
        params.length ? this.bunyan.warn(err, params) : this.bunyan.warn(err);
    };

    /**
     * Log an info message
     */
    info = (err: Error | Object | unknown, ...params: any[]) => {
        params.length ? this.bunyan.info(err, params) : this.bunyan.info(err);
    };

    /**
     * Log a debug message
     */
    debug = (err: Error | Object | unknown, ...params: any[]) => {
        params.length ? this.bunyan.debug(err, params) : this.bunyan.debug(err);
    };
}
