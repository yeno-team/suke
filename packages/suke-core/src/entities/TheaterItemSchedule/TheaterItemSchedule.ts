import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TheaterItem, TheaterItemModel } from "../TheaterItem";

export enum ScheduleState {
    Waiting,
    Delayed,
    Starting,
    Started,
    Ended,
    Canceled
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

    @Column('timestamptz')
    time!: Date;

    @Column('enum', { enum: ScheduleState, default: ScheduleState.Waiting })
    state!: ScheduleState;

    @ManyToOne(() => TheaterItemModel, item => item.schedules, { eager: true, cascade: true })
    item!: TheaterItemModel
}
