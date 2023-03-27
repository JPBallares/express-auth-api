import BaseError from './BaseError';

class BadRequest extends BaseError {
    constructor(description: string) {
        super('Bad Request', 400, true, description);
    }
}

export default BadRequest;
