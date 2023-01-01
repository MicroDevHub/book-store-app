import { BaseError } from "./base-error";

export class BadRequestError extends BaseError {
    statusCode = 400;

    constructor(public message: string) {
        super(message);        // Just for logging on server
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
