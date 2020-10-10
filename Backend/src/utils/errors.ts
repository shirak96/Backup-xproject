import * as HttpStatus from 'http-status-codes';
import {ValidationError} from "class-validator";
import {Response} from "express";

export class ErrorHandler extends Error {
    statusCode: Number;
    details: Array<string | ValidationError>;

    constructor(
        statusCode: Number = 500,
        message: any,
        details: Array<string | ValidationError> = [],
    ) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
    }
}

export const handleError = (err: any, res: Response) => {
    const {message, details} = err;
    let statusCode = 500;
    if (err.statusCode) {
        statusCode = err.statusCode;
    }

    const response = {
        status: {
            text: HttpStatus.getStatusText(statusCode),
            code: statusCode,
        },
        message: message,
        details: statusCode !== 400 ? details : formatValidationError(details),
    };
    res.status(statusCode).json(response);
};

const formatValidationError = (errors: Array<ValidationError>) => {

    return errors.map(error => {
        const {property, value, constraints} = error;
        const constraintsErrors = Object.values(constraints).map(errorMsg => {
            return errorMsg.replace(` in scope: ${property}`, '');
        });

        return {
            property,
            value,
            errors: constraintsErrors

        }
    })
};
