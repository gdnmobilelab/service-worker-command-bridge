import { Action } from "./interfaces";
function createPendingPromise() {
    var fulfill, reject;
    var promise = new Promise(function (f, r) {
        fulfill = f;
        reject = r;
    });
    return [promise, fulfill, reject];
}
export function runServiceWorkerCommand(name, data) {
    var command = { name: name, data: data };
    var channel = new MessageChannel();
    var _a = createPendingPromise(), promise = _a[0], fulfill = _a[1], reject = _a[2];
    channel.port2.addEventListener("message", function (e) {
        var response = e.data;
        if (response.error) {
            reject(response.error);
        }
        else {
            fulfill(response.data);
        }
        channel.port2.close();
    });
    channel.port2.start();
    return navigator.serviceWorker.ready.then(function (reg) {
        reg.active.postMessage({
            action: Action.RunCommand,
            command: command,
            respondOn: channel.port1
        }, [channel.port1]);
        return promise;
    });
}
//# sourceMappingURL=client.js.map