import { runServiceWorkerCommand } from "../lib";

navigator.serviceWorker.register("./worker.js");

runServiceWorkerCommand("test-function", {
    input: 5
}).then(output => {
    let worked = output == 10;

    let text = worked ? "It works" : "It didn't work";
    document.body.innerHTML += text;
});
