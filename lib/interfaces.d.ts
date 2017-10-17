export interface Command {
    name: string;
    data?: any;
}
export interface CommandResponse {
    data?: any;
    error?: Error;
}
export declare enum Action {
    RunCommand = "run-command",
}
