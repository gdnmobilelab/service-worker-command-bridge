import { Command, CommandResponse, Action } from "./interfaces";

function createPendingPromise<T>(): [Promise<T>, (T) => void, (Error) => void] {
    let fulfill, reject;
    let promise = new Promise<T>((f, r) => {
        fulfill = f;
        reject = r;
    });
    return [promise, fulfill, reject];
}

export class ServiceWorkerNotSupportedError extends Error {
    constructor() {
        super("Service workers are not supported");
        Object.setPrototypeOf(this, ServiceWorkerNotSupportedError.prototype);
    }
}

export function runServiceWorkerCommand<I, O>(
    name: string,
    data?: I
): Promise<O> {
    if ("serviceWorker" in navigator === false) {
        throw new ServiceWorkerNotSupportedError();
    }

    let command: Command = { name, data };

    let channel = new MessageChannel();

    let [promise, fulfill, reject] = createPendingPromise<O>();

    channel.port2.addEventListener("message", (e: MessageEvent) => {
        let response = e.data as CommandResponse;
        if (response.error) {
            reject(new Error(response.error));
        } else {
            fulfill(response.data);
        }
        channel.port2.close();
    });

    channel.port2.start();

    return navigator.serviceWorker.ready.then(reg => {
        reg.active!.postMessage(
            {
                action: Action.RunCommand,
                command: command,
                respondOn: channel.port1
            },
            [channel.port1]
        );

        return promise;
    });
}
