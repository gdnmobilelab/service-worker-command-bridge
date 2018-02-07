var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Action } from "./interfaces";
function createPendingPromise() {
    var fulfill, reject;
    var promise = new Promise(function (f, r) {
        fulfill = f;
        reject = r;
    });
    return [promise, fulfill, reject];
}
var ServiceWorkerNotSupportedError = /** @class */ (function (_super) {
    __extends(ServiceWorkerNotSupportedError, _super);
    function ServiceWorkerNotSupportedError() {
        var _this = _super.call(this, "Service workers are not supported") || this;
        Object.setPrototypeOf(_this, ServiceWorkerNotSupportedError.prototype);
        return _this;
    }
    return ServiceWorkerNotSupportedError;
}(Error));
export { ServiceWorkerNotSupportedError };
export function runServiceWorkerCommand(name, data) {
    if ("serviceWorker" in navigator === false) {
        throw new ServiceWorkerNotSupportedError();
    }
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