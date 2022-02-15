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

    @Column()
    title!: string;

    @Column()
    viewerCount!: number;

    @OneToMany(() => TheaterItemFollower, follower => follower.followedTo)
    followers!: TheaterItemFollower[];

    @Column()
    posterUrl!: string;

    @Column({
        nullable: true
    })
    episode!: number | undefined;

    @Column()
    category!: TheaterCategory;

    @OneToMany(() => TheaterItemScheduleModel, schedule => schedule.item)
    schedules!: TheaterItemSchedule[];

    @Column({default: false})
    featured!: boolean;
}




