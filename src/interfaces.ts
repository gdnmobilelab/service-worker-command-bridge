export interface Command {
    name: string;
    data?: any;
}

export interface CommandResponse {
    data?: any;
    error?: string;
}

export enum Action {
    RunCommand = "run-command"
}
