import { Command, CommandResponse, Action } from "./interfaces";

function createPendingPromise<T>(): [Promise<T>, (T) => void, (Error) => void] {
    let fulfill, reject;
    let promise = new Promise<T>((f, r) => {
        fulfill = f;
        reject = r;
    });
    return [promise, fulfill, reject];
}

export function runServiceWorkerCommand<T>(name: string, data?: T) {
    let command: Command = { name, data };

    let channel = new MessageChannel();

    let [promise, fulfill, reject] = createPendingPromise<T>();

    channel.port2.addEventListener("message", (e: MessageEvent) => {
        let response = e.data as CommandResponse;
        if (response.error) {
            reject(response.error);
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
