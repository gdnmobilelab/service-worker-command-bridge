export interface Command {
    name: string;
    data?: any;
}

export interface CommandResponse {
    data?: any;
    error?: Error;
}

export enum Action {
    RunCommand = "run-command"
}
