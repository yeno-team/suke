import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PropertyValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";
import { ITheaterItem, TheaterItemModel } from "../TheaterItem";

export enum ScheduleState {
    Waiting,
    Delayed,
    Starting,
    Started,
    Ended,
    Canceled
}

export interface ITheaterItemSchedule {
    id: number,
    time: Date,
    state: ScheduleState,
    item: ITheaterItem
}

export class TheaterItemSchedule extends ValueObject implements ITheaterItemSchedule {
    id: number;
    time: Date;
    state: ScheduleState;
    item: ITheaterItem;

    constructor(item: ITheaterItemSchedule) {
        super();
        this.id = item.id;
        this.time = item.time;
        this.state = item.state;
        this.item = item.item;
        this.IsValid();
    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.id;
        yield this.time;
        yield this.state;
        yield this.item;
        return;
    }
    protected IsValid(): boolean {
        if (typeof(this.id) != 'number') throw new PropertyValidationError('id');
        if (typeof(this.time) != 'object') throw new PropertyValidationError('time');
        if (typeof(this.state) != 'number') throw new PropertyValidationError('state');
        if (typeof(this.item) != 'object') throw new PropertyValidationError('item');
        return true;
    }
}

@Entity()
export class TheaterItemScheduleModel extends BaseEntity implements ITheaterItemSchedule {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('timestamptz')
    time!: Date;

    @Column('enum', { enum: ScheduleState, default: ScheduleState.Waiting })
    state!: ScheduleState;

    @ManyToOne(() => TheaterItemModel, item => item.schedules, { eager: true, onDelete: 'CASCADE' })
    item!: TheaterItemModel
}
