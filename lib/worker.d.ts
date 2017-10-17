export declare type Listener<T> = (T) => any;
export declare class CommandBridgeListener {
    private boundFunctions;
    processMessage(e: any): void;
    bind<T>(name: string, listener: Listener<T>): void;
    listen(): void;
}
export declare const CommandListener: CommandBridgeListener;
