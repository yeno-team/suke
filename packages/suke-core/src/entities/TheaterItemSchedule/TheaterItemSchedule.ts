import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TheaterItem, TheaterItemModel } from "../TheaterItem";

export enum ScheduleState {
    Waiting,
    Starting,
    Started,
    Ended
}

export interface TheaterItemSchedule {
    id: number,
    time: Date,
    state: ScheduleState,
    item: TheaterItem
}


@Entity()
export class TheaterItemScheduleModel extends BaseEntity implements TheaterItemSchedule {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    time!: Date;

    @Column()
    state!: ScheduleState;

    @ManyToOne(() => TheaterItemModel, item => item.schedules, { eager: true })
    item!: TheaterItemModel
}
