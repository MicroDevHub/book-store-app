import { ValidationError } from "express-validator";
import { BaseError } from "./base-error";

export class RequestValidationError extends BaseError {
    statusCode = 400;
    constructor(private errors: ValidationError[]) {
        super('Invalid request parameters');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return this.errors.map((err) => {
            return { message: err.msg, field: err.param }
        });
    }
}
