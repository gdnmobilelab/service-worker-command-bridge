import { CommandListener } from "../lib";

self.addEventListener("install", e => {
    self.skipWaiting();
});

self.addEventListener("activate", e => {
    self.clients.claim();
});

CommandListener.bind("test-function", data => {
    let input = data.input;
    let output = input * 2;
    return output;
});

CommandListener.listen();
