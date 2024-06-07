export class AuthorizationError extends Error {
    constructor() {
        super('errors.common.command.no_permission');

        this.name = 'AuthorizationError';
    }
}
