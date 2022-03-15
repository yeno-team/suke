import { AfterLoad, BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PropertyValidationError, ValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";
import { Follower } from "../Follower";

export enum ChannelRole {
    Moderator,
    VIP
}

export type UserWithChannelRole = {
    userId: number,
    role: ChannelRole
}

export interface IUserChannel {
    id: number;
    followers: Follower[];
    desc_title: string;
    desc: string;
    followerCount: number;
    roledUsers: UserWithChannelRole[]
}

export class UserChannel extends ValueObject implements IUserChannel {
    id: number;
    followers: Follower[];
    desc_title: string;
    desc: string;
    roledUsers: UserWithChannelRole[];
    followerCount: number;

    constructor(channel: IUserChannel) {
        super();

        this.id = channel.id;
        this.followers = channel.followers;
        this.desc_title = channel.desc_title;
        this.desc = channel.desc;
        this.roledUsers = channel.roledUsers;
        this.followerCount = channel.followerCount;

        if (!this.IsValid()) {
            throw new ValidationError(`Channel object ${JSON.stringify(channel)} is not valid`);
        }
    }
    

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.id;
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
            this.followers = [];
        }

        if (this.desc_title == null || this.desc_title === '') {
            this.desc_title = "About me";
        }

        if (this.desc == null || this.desc === '') {
            this.desc = "Welcome to my channel!";
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

    @OneToMany(() => Follower, follower => follower.followedTo)
    followers!: Follower[];

    followerCount!: number;

    @Column('text')
    desc_title!: string;

    @Column('text')
    desc!: string;

    @Column('jsonb', {nullable: true})
    roledUsers!: UserWithChannelRole[];

    @AfterLoad()
    async countFollowers() {
        const { count } = await Follower.createQueryBuilder('follower')
            .where('follower.followerId = :id', {id: this.id})
            .select('COUNT(*)', 'count')
            .getRawOne();
        this.followerCount = parseInt(count);
    }
}