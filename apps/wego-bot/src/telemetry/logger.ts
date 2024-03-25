/* eslint-disable @typescript-eslint/ban-types */
import Bunyan from 'bunyan';
import {injectable} from 'tsyringe';

@injectable()
export default class Logger {
    private bunyan: Bunyan;

    constructor() {
        this.bunyan = Bunyan.createLogger({
            name: 'wego-overseer',
            level: 0,
        });
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
