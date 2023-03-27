import BaseError from './BaseError';

class NotFound extends BaseError {
    constructor(description: string) {
        super('Not Found', 404, true, description);
    }
}

export default NotFound;
