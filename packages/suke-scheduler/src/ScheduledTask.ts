

export interface ScheduledTask {
    // time between intervals in seconds
    intervalTime: number;
    execute(): Promise<void>;
}