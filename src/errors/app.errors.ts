export class AppErrors extends Error {
    public readonly errorCode: number;

    constructor(message: string, errorCode: number) {
        super(message);
        this.errorCode = errorCode;
    }
}

export class NotFoundError extends AppErrors{
    constructor(resourceName: string ){
        super(`${resourceName} Not found.. We searched... honestly... but didn't find it 😔`, 404)
    }
}

export class BadRequestError extends AppErrors{
    constructor(message: string = "Bad request. Check your data." ){
        super(message, 400)
    }
}

export class ValidateError extends AppErrors{
	inner: any;
    constructor(message: string = `The form said: "not today" 👀. Please check that the fields are filled in correctly.` ){
        super(message, 422)
    }
}

export class LoginError extends AppErrors{
    constructor(message: string = `Incorrect credentials. We won't let you in without a ticket 👋.` ){
        super(message, 401)
    }
}

export class ConflictError extends AppErrors{
    constructor(resourceName: string ){
        super(`${resourceName} already exists`, 409)
    }
}

export class InternalServerError extends AppErrors {
	constructor(message: string = "Internal Server Error") {
		super(message, 500);
	}
}