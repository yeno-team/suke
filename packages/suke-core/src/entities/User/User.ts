import { BaseEntity, Column, Entity, getRepository, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Email, EmailModel, IEmail } from "../Email";
import { Role } from '../../Role';
import { ValueObject } from '../../ValueObject';
import { lowercaseTransformer } from '../../transformers/ValueTransformers';
import { PropertyValidationError } from "../../exceptions/ValidationError";
import { IUserChannel, UserChannelModel } from "../UserChannel/UserChannel";
import * as bcrypt from 'bcrypt';
import { Name } from "../Name/Name";
import { UserId } from "../UserId";
import { Follower } from "../Follower";
import isValidEmail from "@suke/suke-util/src/isValidEmail";

export interface IBaseUser {
    id : number;
    name : string;
    isVerified : boolean;
    channel : IUserChannel;
    following : Follower[];
    role : Role;
}
export interface IUser extends IBaseUser {
    email : string;
}

export interface IDBUser extends IBaseUser {
    email : IEmail;
}

export type Author = Pick<IUser, "id" | "name">;

export interface IHasUser {
    user: IUser;
}

export enum UserIdentifier {
    Id,
    Username
}

export class User extends ValueObject implements IUser {
    public id: number;
    public name: string;
    public isVerified: boolean;
    public role: Role;
    public email : string;
    public channel: IUserChannel;
    public following: Follower[];

    private _name : Name;
    private _id : UserId;

    constructor(user : IUser) {
        super();

        this.id = user.id;
        this._id = new UserId(this.id);
        this.name = user.name;
        this._name = new Name(this.name);
        this.isVerified = user.isVerified;
        this.email = user.email;
        this.role = user.role;
        this.channel = user.channel;
        this.following = user.following;
    }

    public Name() : Name {
        return this._name;
    }

    public Id(): UserId {
        return this._id;
    }
        
    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.id;
        yield this.name;
        yield this.isVerified;
        yield this.role;
        yield this.channel;
        yield this.following;

        return;
    }
    
    protected IsValid(): boolean {
        if (this.role == null) {
            this.role = Role.User;
        }

        if (typeof(this.id) !== 'number') {
            throw new PropertyValidationError('id');
        }

        if (typeof(this.role) !== 'number') {
            throw new PropertyValidationError('role');
        }

        if (typeof(this.isVerified) !== "boolean") {
            throw new PropertyValidationError("isVerified");
        }

        if(typeof(this.email) !== "string" || !(isValidEmail(this.email))) {
            throw new PropertyValidationError("email");
        }
        
        return true;
    }
}

// export class DBUser extends User implements IUser {
//     // public email: IEmail;
//     public _email : Email;

//     constructor(user : IUser) {
//         super(user);

//         // this.email = user.email;
//         // this._email = new Email(this.email);
//     }
// }

@Entity()
export class UserModel extends BaseEntity implements IDBUser  {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Index({ unique: true })
    @Column({
        unique: true,
        nullable: false,
        transformer: [lowercaseTransformer],
    })
    public name!: string;

    @OneToOne(() => EmailModel , emailModel => emailModel.user)
    @JoinColumn()
    public email! : EmailModel    

    @Column({
        nullable : false,
        default : false
    })
    public isVerified! : boolean;

    @Column({
        nullable: false,
        select: false
    })
    public salt!: string;

    @Column({ type: 'enum', enum: Role, default: Role.User })
    public role!: Role;

    @OneToOne(() => UserChannelModel)
    @JoinColumn()
    public channel!: UserChannelModel;

    @OneToMany(() => Follower, follower => follower.follower, { cascade: ['insert', 'update', 'remove'] })
    public following!: Follower[];

    public async testRawPassword(rawPass: string): Promise<boolean> {
        const userRepo = getRepository(UserModel);
        const user = await userRepo.findOne({
            select: ['id', 'salt'],
            where: { id: this.id }
        });

        if (userRepo == null || user == null) {
            return Promise.reject("User does not exist.");
        }

        return bcrypt.compare(rawPass, user.salt);
    } 
}