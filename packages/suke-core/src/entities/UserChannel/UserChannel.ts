import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PropertyValidationError, ValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";

export interface IUserChannel {
    id: number;
    followers: number;
    desc_title: string;
    desc: string;
}

export class UserChannel extends ValueObject implements IUserChannel {
    id: number;
    followers: number;
    desc_title: string;
    desc: string;
    
    constructor(channel: IUserChannel) {
        super();

        this.id = channel.id;
        this.followers = channel.followers;
        this.desc_title = channel.desc_title;
        this.desc = channel.desc;

        if (!this.IsValid()) {
            throw new ValidationError(`Channel object ${JSON.stringify(channel)} is not valid`);
        }
    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.followers;
        yield this.desc_title;
        yield this.desc;

        return;
    }

    protected IsValid(): boolean {
        if (this.id < 0 || typeof(this.id) !== 'number') {
            return false;
        }

        if (this.followers == null) {
            this.followers = 0;
        }

        if (this.desc_title == null || this.desc_title === '') {
            this.desc_title = "About me";
        }

        if (this.desc == null || this.desc === '') {
            this.desc = "Welcome to my channel!";
        }

        if (typeof(this.followers) !== 'number') {
            throw new PropertyValidationError('followers');
        }

        if (typeof(this.desc_title) !== 'string') {
            throw new PropertyValidationError('desc_title');
        }

        if (typeof(this.desc) !== 'string') {
            throw new PropertyValidationError('desc');
        }

        return true;
    }
}

@Entity()
export class UserChannelModel extends BaseEntity implements IUserChannel {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    followers!: number;

    @Column()
    desc_title!: string;

    @Column()
    desc!: string;
}