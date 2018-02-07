export declare class ServiceWorkerNotSupportedError extends Error {
    constructor();
}
export declare function runServiceWorkerCommand<I, O>(name: string, data?: I): Promise<O>;
