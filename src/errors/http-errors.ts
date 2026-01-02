import { AppError } from "./app-error";

export class BadRequestError extends AppError {
    constructor(message = "Bad request"){
        super(message,400)
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message,404)
    }
}

export class ConflitError extends AppError {
    constructor(message = "Conflict") {
        super(message,409)
    }
}

export class InternalServerError extends AppError {
    constructor(message = "Internal server error") {
        super(message,500)
    }
}