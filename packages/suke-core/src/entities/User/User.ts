import { BaseEntity, Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from '../../Role';
import { ValueObject } from '../../ValueObject';
import { lowercaseTransformer } from '../../transformers/ValueTransformers';
import { PropertyValidationError } from "../../exceptions/ValidationError";
import { isValidEmail } from '@suke/suke-util';
import { IUserChannel, UserChannelModel } from "../UserChannel/UserChannel";
import bcrypt from 'bcrypt';
import { Name } from "../Name/Name";

export interface IUser {
    id: number;
    name: string;
    email: string;
    role: Role;
    channel: IUserChannel
}
export class User extends ValueObject implements IUser {
    public id: number;
    public name: string;
    public email: string;
    public role: Role;
    public channel: IUserChannel;

    private _name: Name;
 
    constructor(user: IUser) {
        super();

        this.id = user.id;
        this.name = user.name;
        this._name = new Name(this.name);
        this.email = user.email;
        this.role = user.role;
        this.channel = user.channel;

        this.IsValid();
    }

    public Name(): Name {
        return this._name;
    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.id;
        yield this.name;
        yield this.email;
        yield this.role;

        return;
    }

    protected IsValid(): boolean {
        if (this.id == null) {
            this.id = -1;
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
    public salt!: string;

    @Column({ type: 'enum', enum: Role, default: Role.User })
    public role!: Role;

    @OneToOne(() => UserChannelModel)
    @JoinColumn()
    public channel!: UserChannelModel;

    public testRawPassword(rawPass: string): Promise<boolean> {
        return bcrypt.compare(rawPass, this.salt);
    } 
}

