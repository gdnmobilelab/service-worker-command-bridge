# service-worker-command-bridge

A utility library to facilitate communication between a Service
Worker and web page client through Promises.

## Why?

Service Worker communication is message-based, which makes it
difficult to maintain a Promise-like flow when running a command inside the
worker and parsing the result inside the web client.

## How do I use it?

You should require the library in both your worker and client JS, like so:

*In Service Worker*
    
    import { CommandListener } from "service-worker-command-bridge";
    
    CommandListener.bind("test-command", (data) => {
        
        // You can return a value directly, or return a promise
        // and the bridge will return the resolved value to
        // the client.
        
        return data.startNumber * 10;
    })
    
*In client*

    import { runServiceWorkerCommand } from "service-worker-command-bridge";
    
    runServiceWorkerCommand("test-command", {
        startNumber: 10
    })
    .then((endNumber) => {
        console.log(endNumber); // = 100
    })

## Upgrading from v1

Version 2.0 has a number of breaking changes you should be aware of:

- It now uses ES6 modules, so your build system needs to be able to handle them. Rollup and the latest version of Webpack should work fine. Optimally your build system will also support tree-shaking, as both the client and worker sides are included in `index.js`.
- On the worker side, you must now call `CommandListener.listen()` to start the bridge.
- It has been rewritten in TypeScript, and emits definition files for you to use.