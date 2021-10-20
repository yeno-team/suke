
export interface ILogger {
    log(msg: string): void;
}

export class Logger implements ILogger {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }

    log(msg: string): void {
        console.log(msg);
    }
}