import { Action, Command, CommandResponse } from "./interfaces";
import deepForEach from "deep-for-each";

export type Listener<T> = (T) => any;

export class CommandBridgeListener {
    private boundFunctions: { [key: string]: Listener<any> } = {};

    processMessage(e) {
        if (!e.data || !e.data.action || e.data.action !== Action.RunCommand) {
            return;
        }

        let command = e.data.command as Command;
        let respondOn = e.data.respondOn as MessagePort;

        let listener = this.boundFunctions[command.name];

        if (!listener) {
            return;
        }

        Promise.resolve(listener(command.data))
            .then(returnData => {
                return { data: returnData } as CommandResponse;
            })
            .catch(error => {
                return { error: error.message } as CommandResponse;
            })
            .then(response => {
                let transferables: (MessagePort | ArrayBuffer)[] = [];

                deepForEach(response, value => {
                    if (
                        value instanceof MessagePort ||
                        value instanceof ArrayBuffer
                    ) {
                        transferables.push(value);
                    }
                });

                respondOn.postMessage(response, transferables);
            });
    }

    bind<T>(name: string, listener: Listener<T>) {
        if (this.boundFunctions[name]) {
            throw new Error(`Command is already bound to ${name}`);
        }
        this.boundFunctions[name] = listener;
    }

    listen() {
        self.addEventListener("message", this.processMessage.bind(this));
    }
}

export const CommandListener = new CommandBridgeListener();
