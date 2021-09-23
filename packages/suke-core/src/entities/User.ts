import { BaseEntity, Column, Entity, Index, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { Role } from '../Role';
import { ValueObject } from '../ValueObject';
import { lowercaseTransformer } from '../transformers/ValueTransformers';
import { PropertyValidationError, ValidationError } from "../exceptions/ValidationError";
import { isValidEmail } from '@suke/suke-util';
export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    salt: string;
    role: Role;
}

export class User extends ValueObject implements IUser {
    public id: number;
    public name: string;
    public email: string;
    public password: string;
    public salt: string;
    public role: Role;
 
    constructor(user: IUser) {
        super();

        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
        this.salt = user.salt;
        this.role = user.role;

        if (!this.IsValid()) {
            throw new ValidationError(`User object ${JSON.stringify(user)} is not valid`);
        }
    }

    protected *GetEqualityProperties(): Generator<any, any, unknown> {
        yield this.id;
        yield this.name;
        yield this.email;
        yield this.password;
        yield this.salt;
        yield this.role;
    }

    protected IsValid(): boolean {
        if (this.id == null) {
            this.id = -1;
        }

        if (this.salt == null) {
            this.salt = "";
        }

        if (this.role == null) {
            this.role = Role.User;
        }

        if (typeof(this.id) !== 'number') {
            throw new PropertyValidationError('id');
        }

        if (typeof(this.email) !== 'string' || !isValidEmail(this.email)) {
            throw new PropertyValidationError('email');
        }

        if (typeof(this.name) !== 'string') {
            throw new PropertyValidationError('name');
        }

        if (typeof(this.password) !== 'string') {
            throw new PropertyValidationError('password');
        }

        if (typeof(this.salt) !== 'string') {
            throw new PropertyValidationError('salt');
        }

        if (typeof(this.role) !== 'number') {
            throw new PropertyValidationError('role');
        }

        return true;
    }
}

@Entity()
export class UserModel extends BaseEntity implements IUser  {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Index({ unique: true })
    @Column({
        unique: true,
        nullable: false,
        transformer: [lowercaseTransformer],
    })
    public name!: string;

    @Index({ unique: true })
    @Column({
        unique: true,
        nullable: false,
        transformer: [lowercaseTransformer],
    })
    public email!: string;

    @Column({
        select: false,
        nullable: false,
    })
    public password!: string;

    @Column({
        select: false,
        nullable: false,
    })
    public salt!: string;
    

    @Column({ type: 'enum', enum: Role, default: Role.User })
    public role!: Role;
}

