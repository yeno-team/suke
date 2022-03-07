import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PropertyValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";
import { TheaterItemFollower } from "../Follower";
import { ITheaterItemSchedule, TheaterItemScheduleModel } from "../TheaterItemSchedule/";

export interface FeaturedTheaterItem {
    title: string,
    description: string,
    backgroundImage: string,
    episode?: number,
    id: number
}

export enum TheaterCategory {
    everything = "Everything",
    movie = "Movies",
    tvShow = "TV Shows",
    anime = "Anime"
}

export interface ITheaterItem {
    id: number,
    title: string,
    viewerCount: number,
    followers: TheaterItemFollower[],
    posterUrl: string,
    description: string,
    featuredPictureUrl: string,
    episode?: number,
    category: TheaterCategory,
    featured: boolean,
    engine: string,
    sourceUrl: string,
    // in seconds
    duration: number,
    schedules: ITheaterItemSchedule[]
}

export class TheaterItem extends ValueObject implements ITheaterItem {
    id: number;
    title: string;
    viewerCount: number;
    followers: TheaterItemFollower[];
    posterUrl: string;
    episode?: number | undefined;
    category: TheaterCategory;
    featured: boolean;
    engine: string;
    schedules: ITheaterItemSchedule[];
    sourceUrl: string;
    description: string;
    featuredPictureUrl: string;
    duration: number;

    constructor(item: ITheaterItem) {
        super();
        this.id = item.id;
        this.title = item.title;
        this.viewerCount = item.viewerCount;
        this.followers = item.followers;
        this.posterUrl = item.posterUrl;
        this.episode = item.episode;
        this.category = item.category;
        this.featured = item.featured;
        this.schedules = item.schedules;
        this.engine = item.engine;
        this.sourceUrl = item.sourceUrl;
        this.description = item.description;
        this.featuredPictureUrl = item.featuredPictureUrl;
        this.duration = item.duration;
        this.IsValid();
    }
    
    
    

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.id;
        yield this.title;
        yield this.viewerCount;
        yield this.followers;
        yield this.posterUrl;
        yield this.episode;
        yield this.category;
        yield this.featured;
        yield this.schedules;
        return;
    }
    protected IsValid(): boolean {
        if (typeof(this.id) != 'number') throw new PropertyValidationError('id');
        if (typeof(this.title) != 'string') throw new PropertyValidationError('title');
        if (typeof(this.viewerCount) != 'number') throw new PropertyValidationError('viewerCount');
        if (typeof(this.followers) != 'object') throw new PropertyValidationError('followers');
        if (typeof(this.posterUrl) != 'string') throw new PropertyValidationError('posterUrl');
        if (typeof(this.category) != 'string') throw new PropertyValidationError('category');
        if (typeof(this.engine) != 'string') throw new PropertyValidationError('engine');
        if (typeof(this.sourceUrl) != 'string') throw new PropertyValidationError('sourceUrl');
        if (typeof(this.featured) != 'boolean') throw new PropertyValidationError('featured');
        if (typeof(this.schedules) != 'object') throw new PropertyValidationError('schedules');
        return true;
    }
}


@Entity()
export class TheaterItemModel extends BaseEntity implements ITheaterItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    title!: string;

    @Column('integer')
    viewerCount!: number;

    @OneToMany(() => TheaterItemFollower, follower => follower.followedTo, { cascade: true })
    followers!: TheaterItemFollower[];

    @Column('text')
    posterUrl!: string;

    @Column({
        nullable: true,
        type: 'integer'
    })
    season!: number | undefined;

    @Column({
        type: 'decimal',
        default: 0
    })
    duration!: number;

    @Column({
        nullable: true,
        type: 'integer'
    })
    episode!: number | undefined;

    @Column({
        type: 'text'
    })
    engine!: string;

    @Column({
        type: 'text'
    })
    sourceUrl!: string;

    @Column({
        type: 'text',
        default: 'Default Description'
    })
    description!: string;

    @Column({
        type: 'text',
        default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAAETCAMAAABDSmfhAAAAP1BMVEXo6Ojp6enn5+fd3d2ZmZmUlJTi4uKbm5u4uLjPz8+Tk5Pt7e2zs7O8vLzW1tbMzMympqbFxcWhoaHBwcGqqqpGcOzZAAAEkElEQVR4nO2di5LiIBBFIS+N5KGZ/P+3Lg15kJhY67h7wap7pmaMktocWeimMTWjuvwb6VSuv5Hceqvvg95Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiNhd5Y6I2F3ljojYXeWOiN5VPvLGB9tnn59MW43moW0POD/Vr/ST03BM3zG/zguv+iv3X27i89rJSO39+6Hi9vMoy5tv9RUb3NT1m8TXnpdNxxonPRLoXZ6ZigVR4HHbe/tevu5to017t7B3d7eMB1cNbjfGIpIyWmd2MdeiPo0R625oTqblsf/rgpi7JOwLvyceVRFrdO7+O0j5WZaW2rm46Z6W9JeBeVHM3ek6z/mrKNnCjelWtNwVs5bx309y5Dqulb+/52h8l4q0PvxTkLxkla/S2HEsmdt8rU8wrF97eRoWMeaXiX10pkOxvqJu+DqSnecmKVqVxCS1xv5fq7GO6WSzF5B/NxmqJTfwcnxu5vF09WFu9wWroH771m+gTGyc47sA4ek/R2qzzvbbZhMNv0d3mZz0xhfJetluydz/NylV3V/bxsMpfyx+jeQd6x4S2M32onn1j81q/yzhRaVLre4frkoCqe1ye5i+4JeKuz/t4GlWxZn8hLKaxPFm/bjYu3WrWXYW6C9WAd3dvHk14vYaJVR0WDnuqGH3diFr9u8Hn+0lwto0so4/WYu2tdTkxinPx9XbwcWu8PLvuP5uUvSKi/y1fdvWmN7+3n5ZhXll7WHUNXHfOQ1rtrrYfo3j7P50a2L12k643b1dTTT7eLqbU8lSDSGTmUwiiF/n6Z59Uu72Sp5R31lOeV91Zr3tnk+Q8u+5/WVUEdv7yJFNdVPqFvvddx4vtbp+Xt4olMN21k5s31jnpaFbq6obYp36b6Nvq89PFkeHR1V1+DOk1te33yLoZeTmzjx+8579ws5a6+3EYUXxcvJ8b2Pqjnn5n3Y9PN83tvtdlHTifPz+O77vv6Wk77J2q/j6zmfYjLo7e0lzS8JZ5IoGiO9pHnQxdPegk8Opl48iLPL5Elsbxz7H1Q0ie2PjnyPvx4PrF8ebo+8aF7G08S8nbzMnc3Exg/81RwM8F6HWX8+lueyIZFbG+/XenqnXqtaA5w1dCYTL2j65tkE5d8ivVn8fShfdDq8k4V9XNue/HhF/cVyOfKke8/0flwO63hz7g16/02kbwzrer2ZI/qjLYzvoaL6W1LGbP5U6Dm4GjfnEX2fq5rdmuTV80xvSNBbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8s9MZCbyz0xkJvLPTGQm8sX+39jeSqe/evbiZB9wdLkUgm3FJ9/AAAAABJRU5ErkJggg=='
    })
    featuredPictureUrl!: string;

    @Column('enum', { enum: TheaterCategory })
    category!: TheaterCategory;

    @OneToMany(() => TheaterItemScheduleModel , schedule => schedule.item, {cascade: true, onDelete: 'CASCADE'})
    schedules!: ITheaterItemSchedule[];

    @Column({default: false, type: 'bool'})
    featured!: boolean;
}




