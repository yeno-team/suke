import 'reflect-metadata';
import tasks from "./tasks";

export const startScheduler = () =>  {
    for (const task of tasks) {
        const intervalLoop = () => {
            setTimeout(async () => {
                await task.execute();
                intervalLoop();
            }, task.intervalTime);
        };
        intervalLoop();
    }
};


