import { Column, Entity, Index, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { Role } from '../Role';
import { ValueObject } from '../ValueObject';
import { lowercaseTransformer } from './ValueTransformers';

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
    }

    protected *GetEqualityProperties(): Generator<any, any, unknown> {
        yield this.id;
        yield this.name;
        yield this.email;
        yield this.password;
        yield this.salt;
        yield this.role;
    }
}

@Entity()
export class UserModel implements IUser {
    @ObjectIdColumn()
    public id!: number;

    @Column()
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

