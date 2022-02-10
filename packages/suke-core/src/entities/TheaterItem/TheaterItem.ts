import { Follower } from "../Follower";


export interface FeaturedTheaterItem {
    title: string,
    description: string,
    backgroundImage: string,
    id: number
}

export interface TheaterItem {
    id: number,
    title: string,
    viewerCount: number,
    followers: Follower[],
    posterUrl: string,
    episode?: number,
    schedules: TheaterItemSchedule[]
}

export enum ScheduleState {
    Waiting,
    Starting,
    Started,
    Ended
}

export interface TheaterItemSchedule {
    id: number,
    time: Date,
    // an array of user ids of users who subscribed to this schedule
    subscribed: Follower[],
    state: ScheduleState
}