import { BaseEntity, Column, Entity, Index, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PropertyValidationError } from "../../exceptions/ValidationError";
import { hideEmailTransformer, lowercaseTransformer } from "../../transformers/ValueTransformers";
import { ValueObject } from "../../ValueObject";
import { UserModel } from "../User";
import isValidEmail from "@suke/suke-util/src/isValidEmail";
export interface IEmail {
    id : number;
    originalEmail : string | null;
    verificationToken : string | null;
    previousEmail : string | null;
    currentEmail : string;
}

export class Email extends ValueObject implements IEmail {
    public id : number;
    public originalEmail : string | null;
    public verificationToken: string | null;
    public previousEmail: string | null;
    public currentEmail: string;

    constructor(email : IEmail) {
        super();
        this.id = email.id;
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
        if(typeof (this.id) !== "number") {
            throw new PropertyValidationError("email id is not a number");
        }

        if(this.originalEmail) {
            console.log(this.originalEmail);
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

@Entity()
@Index(["originalEmail" , "previousEmail" , "currentEmail"])
@Index(["currentEmail"] , { unique : true })
export class EmailModel extends BaseEntity implements IEmail {
    @PrimaryGeneratedColumn()
    public id! : number;

    @Column({ 
        nullable : false,
        transformer : [ lowercaseTransformer , hideEmailTransformer ]
    })
    public originalEmail!: string;

    @Column({ 
        nullable : true , 
        default : null,
        transformer : [ lowercaseTransformer  , hideEmailTransformer ]
    })
    public previousEmail! : string | null;

    @Column({ 
        nullable : true , 
        default : null
    })
    public verificationToken! : string | null;
    
    @Column({ 
        unique : true , 
        nullable : false,
        transformer : [ lowercaseTransformer ] 
    })
    public currentEmail!: string;

    @OneToOne(() => UserModel , user => user.email)
    public user! : UserModel
}