export interface Command {
    name: string;
    data?: any;
}
export interface CommandResponse {
    data?: any;
    error?: string;
}
export declare enum Action {
    RunCommand = "run-command",
}
