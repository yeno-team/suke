import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TheaterItemFollower } from "../Follower";
import { TheaterItemSchedule, TheaterItemScheduleModel } from "../TheaterItemSchedule";

export interface FeaturedTheaterItem {
    title: string,
    description: string,
    backgroundImage: string,
    id: number
}

export enum TheaterCategory {
    Everything,
    Movie,
    TvShow,
    Anime
}

export interface TheaterItem {
    id: number,
    title: string,
    viewerCount: number,
    followers: TheaterItemFollower[],
    posterUrl: string,
    episode?: number,
    category: TheaterCategory,
    featured: boolean,
    schedules: TheaterItemSchedule[]
}

@Entity()
export class TheaterItemModel extends BaseEntity implements TheaterItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    title!: string;

    @Column('integer')
    viewerCount!: number;

    @OneToMany(() => TheaterItemFollower, follower => follower.followedTo)
    followers!: TheaterItemFollower[];

    @Column('text')
    posterUrl!: string;

    @Column({
        nullable: true,
        type: 'integer'
    })
    episode!: number | undefined;

    @Column('enum', { enum: TheaterCategory })
    category!: TheaterCategory;

    @Column('timestamp with time zone')
    @OneToMany(() => TheaterItemScheduleModel, schedule => schedule.item)
    schedules!: TheaterItemSchedule[];

    @Column({default: false, type: 'bool'})
    featured!: boolean;
}




