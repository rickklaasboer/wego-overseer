/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import Bunyan from 'bunyan';

export const LOG_LEVELS = {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    debug: 20,
    trace: 10,
};

export default class Logger {
    private bunyan: Bunyan;

    constructor(name: string, level: keyof typeof LOG_LEVELS) {
        this.bunyan = Bunyan.createLogger({name, level: LOG_LEVELS[level]});
    }

    /**
     * Log a debug message
     */
    public debug(err: Error | Object | unknown, ...params: any[]): void {
        params.length ? this.bunyan.debug(err, params) : this.bunyan.debug(err);
    }

    /**
     * Log an info message
     */
    public info(err: Error | Object | unknown, ...params: any[]): void {
        params.length ? this.bunyan.info(err, params) : this.bunyan.info(err);
    }

    /**
     * Log a warning message
     */
    public warn(err: Error | Object | unknown, ...params: any[]): void {
        params.length ? this.bunyan.warn(err, params) : this.bunyan.warn(err);
    }

    /**
     * Log an error message
     */
    public error(err: Error | Object | unknown, ...params: any[]): void {
        params.length ? this.bunyan.error(err, params) : this.bunyan.error(err);
    }

    /**
     * Log a fatal error message
     */
    public fatal(err: Error | Object | unknown, ...params: any[]): void {
        params.length ? this.bunyan.fatal(err, params) : this.bunyan.fatal(err);
    }
}
