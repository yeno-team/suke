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

export class Email extends ValueObject {
    public value : string;

    constructor(email : string) {
        super();
        this.value = email;

        if(!(this.IsValid())) {
            throw new PropertyValidationError("email");
        }
    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.value;
        return;
    }
    
    protected IsValid() : boolean {
        return isValidEmail(this.value);
    }
}

export class EmailData extends ValueObject implements IEmail {
    public id : number;
    public originalEmail : string | null;
    private _originalEmail : Email | undefined;
    public previousEmail: string | null;
    private _previousEmail : Email | undefined;
    public currentEmail: string;
    private _currentEmail : Email | undefined;
    public verificationToken: string | null;

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
            throw new PropertyValidationError("id");
        }

        if((this.verificationToken) && (typeof this.verificationToken !== "string")) {
            throw new PropertyValidationError("verificationToken");
        }

        if(this.originalEmail) {
            this._originalEmail = new Email(this.originalEmail);
        }

        if(this.previousEmail) {
            this._previousEmail = new Email(this.previousEmail);
        }

        if(this.currentEmail) {
            this._currentEmail = new Email(this.currentEmail);
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
        transformer : [ lowercaseTransformer , hideEmailTransformer ],
        type: 'text'
    })
    public originalEmail!: string;

    @Column({ 
        nullable : true , 
        default : null,
        transformer : [ lowercaseTransformer  , hideEmailTransformer ],
        type: 'text'
    })
    public previousEmail! : string | null;

    @Column({ 
        nullable : true, 
        default : null,
        type: 'text'
    })
    public verificationToken! : string | null;
    
    @Column({ 
        unique : true , 
        nullable : false,
        transformer : [ lowercaseTransformer ],
        type: 'text'
    })
    public currentEmail!: string;

    @OneToOne(() => UserModel , user => user.email)
    public user! : UserModel
}