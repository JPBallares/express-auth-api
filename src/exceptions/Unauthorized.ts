import BaseError from './BaseError';

class Unauthorized extends BaseError {
    constructor(description: string) {
        super('Unauthorized', 401, true, description);
    }
}

export default Unauthorized;
