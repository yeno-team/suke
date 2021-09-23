export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export class PropertyValidationError extends ValidationError {
    public property: string;

    constructor(property: string) {
        super(`Property '${property}' is not valid.'`);
        this.name = "PropertyValidationError";
        this.property = property;
    }
}