export class AuthorizationError extends Error {
    constructor() {
        super('You do not have permission to use this command!');

        this.name = 'AuthorizationError';
    }
}
