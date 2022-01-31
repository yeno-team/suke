import isValidEmail from "@suke/suke-util/src/isValidEmail";
import { BaseEntity } from "typeorm";
import { PropertyValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";

export interface IEmail {
    originalEmail : string | null;
    verificationToken : string | null;
    previousEmail : string | null;
    currentEmail : string;
}

export class Email extends ValueObject implements IEmail {
    public originalEmail : string | null;
    public verificationToken: string | null;
    public previousEmail: string | null;
    public currentEmail: string;

    constructor(email : IEmail) {
        super();
        this.originalEmail = email.originalEmail;
        this.verificationToken = email.verificationToken;
        this.previousEmail = email.previousEmail;
        this.currentEmail = email.currentEmail;

        this.IsValid();
    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.originalEmail;
        yield this.verificationToken;
        yield this.previousEmail;
        yield this.currentEmail;
        return;
    }

    protected IsValid(): boolean {
        if(this.originalEmail) {
            if(typeof this.originalEmail !== "string") {
                throw new PropertyValidationError("originalEmail is not a string.");
            }

            if(!(isValidEmail(this.originalEmail))) {
                throw new PropertyValidationError("originalEmail value is not a valid email.");
            }
        }

        if(this.previousEmail) {
            if(typeof this.previousEmail !== "string") {
                throw new PropertyValidationError("previousEmail is not a string.");
            }

            if(!(isValidEmail(this.previousEmail))) {
                throw new PropertyValidationError("previousEmail is not a valid email.");
            }
        }


        if((this.verificationToken) && (typeof this.verificationToken !== "string")) {
            throw new PropertyValidationError("verificationToken is not a string.");
        }

        if(!(this.currentEmail)) {
            throw new PropertyValidationError("currentEmail must be required.");
        }

        if(typeof this.currentEmail !== "string") {
            throw new PropertyValidationError("currentEmail is not astring.");
        }

        return true;
    }   
}

// export class EmailModel extends BaseEntity {

// }